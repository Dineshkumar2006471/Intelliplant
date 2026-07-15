import os
import json
import base64
from db import supabase
from google import genai
from google.genai import types
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# We configure the Gemini Client using the provided API Key (used for embeddings only)
api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

# Configure Groq Client (used for all LLM generation, tool-calling, and vision)
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# ---------------------------------------------------------
# Tools / Functions
# ---------------------------------------------------------

def query_knowledge_graph(equipment_tag: str) -> str:
    """Query the industrial plant knowledge graph for equipment history, P&ID relationships, or compliance data."""
    tag = equipment_tag.upper()
    try:
        # 1. Get Node Info
        node_res = supabase.table("knowledge_nodes").select("*").eq("tag", tag).execute()
        
        if not node_res.data:
            return f"No records found in the knowledge graph for {tag}."
            
        node = node_res.data[0]
        result = [f"Equipment: {node.get('name', tag)} (Type: {node.get('type')})"]
        
        if node.get("properties"):
            result.append(f"Properties: {node.get('properties')}")
            
        # 2. Get Edges (Relationships)
        edges_res = supabase.table("knowledge_edges").select("*, target:target_id(tag, name)").eq("source_id", node["id"]).execute()
        for edge in edges_res.data:
            target_tag = edge.get("target", {}).get("tag", "Unknown")
            result.append(f"Relationship: {edge['relation_type']} {target_tag}")
            
        # 3. Get Expert Tribal Knowledge
        expert_res = supabase.table("expert_captures").select("*").eq("equipment_tag", tag).execute()
        for exp in expert_res.data:
            result.append(f"Expert Note ({exp['expert_name']}): {exp['knowledge_text']}")
            
        return "\n".join(result)
        
    except Exception as e:
        return f"Database query failed: {str(e)}"

def detect_contradictions(chunks: list) -> str:
    if len(chunks) < 2:
        return ""
    
    prompt = "You are a contradiction detector. Analyze the following document chunks. If they contradict each other (e.g. different maintenance intervals, conflicting regulations like Factories Act vs OSH Code), output a brief warning explaining the contradiction. If they agree or are unrelated, output exactly the word 'NONE'.\n\nChunks:\n"
    for i, c in enumerate(chunks):
        prompt += f"Chunk {i+1}: {c}\n\n"
        
    try:
        # groq_client might not be initialized yet if called before it's defined, 
        # but ask_copilot relies on it and is below. We will ensure groq_client is available.
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0
        )
        ans = response.choices[0].message.content.strip()
        if "NONE" not in ans.upper():
            return f"⚠️ Contradiction Detected: {ans}"
    except Exception as e:
        pass
    return ""

def search_documents(search_query: str) -> tuple[str, str]:
    """Search the plant's document library (PDFs, Manuals, Compliance regulations like Factory Act or OISD) for a specific text query."""
    if not client:
        return "Gemini API key is not configured.", ""
        
    try:
        response = client.models.embed_content(
            model='gemini-embedding-2',
            contents=search_query,
            config=types.EmbedContentConfig(output_dimensionality=768)
        )
        query_vector = response.embeddings[0].values
        
        # Call the Supabase RPC for semantic search
        res = supabase.rpc('match_documents', {
            'query_embedding': query_vector,
            'match_threshold': 0.70,
            'match_count': 3
        }).execute()
                
        if not res.data:
            return f"No documents found matching '{search_query}'.", ""
            
        chunks_text = [doc['content'] for doc in res.data]
        contradiction_warning = detect_contradictions(chunks_text)

        result = [f"Found {len(res.data)} relevant document chunks:"]
        if contradiction_warning:
            result.append(contradiction_warning)

        for i, doc in enumerate(res.data):
            result.append(f"--- Chunk {i+1} ---\n{doc['content']}")
            
        return "\n".join(result), contradiction_warning
        
    except Exception as e:
        return f"Document search failed: {str(e)}", ""

# ---------------------------------------------------------
# Agent Flows
# ---------------------------------------------------------

def capture_expert_knowledge(expert_name: str, knowledge_text: str) -> dict:
    if not groq_client:
        return {"status": "error", "message": "Groq client not initialized"}
        
    prompt = f"""
    Extract the equipment tag, failure mode, symptom, and fix from the following expert knowledge.
    Return ONLY a valid JSON object with the keys: 'equipment_tag', 'failure_mode', 'symptom', 'fix'.
    If a tag isn't mentioned, leave it empty.
    
    Text: {knowledge_text}
    """
    
    try:
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        
        extracted = json.loads(response.choices[0].message.content)
        tag = extracted.get("equipment_tag", "").upper()
        
        if tag:
            # Ensure the equipment node exists in knowledge_nodes first (FK constraint)
            try:
                supabase.table("knowledge_nodes").upsert({
                    "tag": tag,
                    "name": tag,
                    "type": "Equipment",
                    "properties": {}
                }, on_conflict="tag").execute()
            except Exception:
                pass
        
        # Insert the expert knowledge
        supabase.table("expert_captures").insert({
            "expert_name": expert_name,
            "knowledge_text": knowledge_text,
            "equipment_tag": tag if tag else None
        }).execute()
        
        return {"status": "success", "extracted": extracted}
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

def parse_pid_image(image_bytes: bytes, mime_type: str) -> dict:
    """Parse a P&ID image using Groq's Llama 4 Scout vision model."""
    
    if not groq_client:
        return {"status": "error", "message": "Groq API key is not configured."}
        
    b64_image = base64.b64encode(image_bytes).decode('utf-8')
    data_url = f"data:{mime_type};base64,{b64_image}"
    
    prompt = """Analyze this P&ID (Piping and Instrumentation Diagram) image carefully.
Identify ALL equipment items (pumps, compressors, tanks, vessels, heat exchangers, valves, instruments, etc.) 
and their connections (pipes, signal lines).
For each equipment item, extract its tag label (like P-101, C-104, TK-202, FCV, FT, PG, etc.) from the drawing.
Return ONLY a valid JSON object with this exact structure:
{
  "nodes": [
    {"tag": "C-104", "type": "Compressor", "name": "Main Gas Compressor"}
  ],
  "edges": [
    {"source_tag": "C-104", "target_tag": "V-20", "relation": "pipes_to"}
  ]
}"""
    
    try:
        response = groq_client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": data_url}}
                ]
            }],
            temperature=0.0,
            response_format={"type": "json_object"}
        )
        
        extracted = json.loads(response.choices[0].message.content)
        
        # Ensure we have the expected keys
        if "nodes" not in extracted:
            extracted["nodes"] = []
        if "edges" not in extracted:
            extracted["edges"] = []
        
        # Insert nodes into Knowledge Graph
        for node in extracted.get("nodes", []):
            try:
                supabase.table("knowledge_nodes").upsert({
                    "tag": node["tag"].upper(),
                    "name": node.get("name", node["tag"]),
                    "type": node.get("type", "Equipment"),
                    "properties": {}
                }, on_conflict="tag").execute()
            except Exception:
                pass
                
        # Insert edges into Knowledge Graph
        for edge in extracted.get("edges", []):
            try:
                source_res = supabase.table("knowledge_nodes").select("id").eq("tag", edge["source_tag"].upper()).execute()
                target_res = supabase.table("knowledge_nodes").select("id").eq("tag", edge["target_tag"].upper()).execute()
                if source_res.data and target_res.data:
                    supabase.table("knowledge_edges").insert({
                        "source_id": source_res.data[0]["id"],
                        "target_id": target_res.data[0]["id"],
                        "relation_type": edge.get("relation", "connected_to")
                    }).execute()
            except Exception:
                pass
                
        return {"status": "success", "extracted": extracted}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"status": "error", "message": str(e)}

def ask_copilot(query: str) -> dict:
    if not groq_client:
        return {"reasoning_steps": [], "response": "Groq API key is not configured in the environment."}

    tools = [
        {
            "type": "function",
            "function": {
                "name": "query_knowledge_graph",
                "description": "Query the industrial plant knowledge graph for equipment history, P&ID relationships, or compliance data.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "equipment_tag": {
                            "type": "string",
                            "description": "The equipment tag (e.g., C-104)"
                        }
                    },
                    "required": ["equipment_tag"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "search_documents",
                "description": "Search the plant's document library (PDFs, Manuals, Compliance regulations like Factory Act or OISD) for a specific text query.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "search_query": {
                            "type": "string",
                            "description": "The search query."
                        }
                    },
                    "required": ["search_query"]
                }
            }
        }
    ]

    messages = [
        {"role": "system", "content": "You are the IntelliPlant Copilot, a highly knowledgeable industrial engineer AI."},
        {"role": "user", "content": query}
    ]

    reasoning_steps = []

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            tools=tools,
            tool_choice="auto",
            temperature=0.2
        )
        
        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls
        
        if tool_calls:
            messages.append(response_message)
            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)
                
                if function_name == "query_knowledge_graph":
                    tag = function_args.get("equipment_tag")
                    reasoning_steps.append(f"Querying Knowledge Graph for equipment '{tag}'...")
                    function_response = query_knowledge_graph(equipment_tag=tag)
                elif function_name == "search_documents":
                    sq = function_args.get("search_query")
                    reasoning_steps.append(f"Searching Plant Documents for '{sq}'...")
                    function_response, warning = search_documents(search_query=sq)
                    if warning:
                        reasoning_steps.append(warning)
                else:
                    function_response = "Unknown function"
                    
                messages.append(
                    {
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": str(function_response),
                    }
                )
                
            second_response = groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=messages,
                temperature=0.2
            )
            return {
                "reasoning_steps": reasoning_steps,
                "response": second_response.choices[0].message.content
            }
        else:
            return {
                "reasoning_steps": reasoning_steps,
                "response": response_message.content
            }

    except Exception as e:
        return {
            "reasoning_steps": reasoning_steps,
            "response": f"I am the IntelliPlant Copilot. (Failed to reach Groq: {e})."
        }

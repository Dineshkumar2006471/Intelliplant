from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import os
import shutil

try:
    from agent import ask_copilot
except Exception as e:
    logging.warning(f"Failed to load agent: {e}")
    ask_copilot = None

try:
    from db import supabase
except Exception as e:
    logging.warning(f"Failed to load db: {e}")
    supabase = None

app = FastAPI(title="IntelliPlant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://intelliplant.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    query: str


@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    if not ask_copilot:
        raise HTTPException(status_code=500, detail="Copilot agent not initialized.")
    try:
        result = ask_copilot(req.query)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class CaptureRequest(BaseModel):
    expert_name: str
    knowledge_text: str


@app.post("/api/capture-knowledge")
async def capture_endpoint(req: CaptureRequest):
    try:
        from agent import capture_expert_knowledge

        result = capture_expert_knowledge(req.expert_name, req.knowledge_text)
        if result["status"] == "error":
            raise HTTPException(
                status_code=500, detail=result.get("message", "Unknown error")
            )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/knowledge-graph")
def get_knowledge_graph():
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured.")
    try:
        nodes_res = supabase.table("knowledge_nodes").select("*").execute()
        edges_res = supabase.table("knowledge_edges").select("*").execute()
        return {"nodes": nodes_res.data, "edges": edges_res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured.")
    try:
        demo_dir = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "demo-data")
        )
        os.makedirs(demo_dir, exist_ok=True)
        file_path = os.path.join(demo_dir, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Return success (ingestion can be run manually or triggered via a background process)
        return {
            "status": "success",
            "filename": file.filename,
            "message": "File uploaded and ready for ingestion.",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/parse-pid")
async def parse_pid_endpoint(file: UploadFile = File(...)):
    try:
        from agent import parse_pid_image

        image_bytes = await file.read()
        mime_type = file.content_type or "image/jpeg"
        result = parse_pid_image(image_bytes, mime_type)
        if result["status"] == "error":
            # Just return the error dictionary so frontend can parse it
            return result
        return result
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/api/health")
def health_check():
    db_status = "ok" if supabase else "unconfigured"
    agent_status = "ok" if ask_copilot else "unconfigured"
    return {"status": "healthy", "database": db_status, "agent": agent_status}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

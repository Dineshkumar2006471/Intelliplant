from db import supabase

def seed_database():
    print("Seeding IntelliPlant Knowledge Graph...")
    
    # 1. Insert Nodes
    nodes = [
        {"tag": "C-104", "name": "Compressor C-104", "type": "equipment", "properties": {"location": "Area 3", "maintenance_interval": "30 days"}},
        {"tag": "V-20", "name": "Valve V-20", "type": "equipment", "properties": {"valve_type": "Flow Control"}},
        {"tag": "E-101", "name": "Heat Exchanger E-101", "type": "equipment", "properties": {}}
    ]
    
    for node in nodes:
        # Check if exists
        res = supabase.table("knowledge_nodes").select("id").eq("tag", node["tag"]).execute()
        if not res.data:
            supabase.table("knowledge_nodes").insert(node).execute()
            print(f"Inserted node {node['tag']}")
            
    # 2. Get IDs for edges
    c104 = supabase.table("knowledge_nodes").select("id").eq("tag", "C-104").execute().data[0]["id"]
    v20 = supabase.table("knowledge_nodes").select("id").eq("tag", "V-20").execute().data[0]["id"]
    e101 = supabase.table("knowledge_nodes").select("id").eq("tag", "E-101").execute().data[0]["id"]
    
    # 3. Insert Edges
    edges = [
        {"source_id": c104, "target_id": v20, "relation_type": "downstream_of"},
        {"source_id": c104, "target_id": e101, "relation_type": "upstream_of"},
        {"source_id": v20, "target_id": c104, "relation_type": "controls_intake_to"}
    ]
    
    for edge in edges:
        try:
            supabase.table("knowledge_edges").insert(edge).execute()
            print(f"Inserted edge {edge['relation_type']}")
        except Exception:
            pass # Ignore unique constraint violations
            
    # 4. Insert Expert Captures
    captures = [
        {"expert_name": "Senior Engineer Dave", "equipment_tag": "C-104", "knowledge_text": "C-104 bearing replaced on 2026-06-15 due to high vibration. Watch the intake pressure closely."}
    ]
    
    for capture in captures:
        res = supabase.table("expert_captures").select("id").eq("equipment_tag", capture["equipment_tag"]).execute()
        if not res.data:
            supabase.table("expert_captures").insert(capture).execute()
            print(f"Inserted expert capture for {capture['equipment_tag']}")
            
    print("Seeding complete.")

if __name__ == "__main__":
    seed_database()

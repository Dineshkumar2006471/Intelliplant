import os
import glob
from db import supabase

def extract_text_from_pdf(filepath):
    try:
        import PyPDF2
        text = ""
        with open(filepath, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        return text
    except ImportError:
        return ""

def process_documents(directory):
    pdf_files = glob.glob(os.path.join(directory, "*.pdf"))
    for filepath in pdf_files:
        filename = os.path.basename(filepath)
        print(f"Mock Processing {filename}...")
        
        doc_res = supabase.table("documents").insert({
            "name": filename,
            "type": "pdf"
        }).execute()
        
        doc_id = doc_res.data[0]["id"]
        
        text = extract_text_from_pdf(filepath)
        
        # Simple Chunking (split by single newline)
        chunks = [chunk.strip() for chunk in text.split("\n") if len(chunk.strip()) > 10]
        
        for i, chunk_text in enumerate(chunks):
            vector = [0.0] * 768
            supabase.table("document_chunks").insert({
                "document_id": doc_id,
                "content": chunk_text,
                "embedding": vector,
                "metadata": {"chunk_index": i}
            }).execute()
            
        supabase.table("documents").update({"status": "indexed"}).eq("id", doc_id).execute()
        print(f"Indexed {len(chunks)} chunks for {filename}.")

if __name__ == "__main__":
    demo_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "demo-data"))
    process_documents(demo_dir)

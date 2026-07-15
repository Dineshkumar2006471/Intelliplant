import os
import glob
from db import supabase
from google import genai
from dotenv import load_dotenv

load_dotenv()

# We configure the Gemini Client using the provided API Key
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("Failed to initialize: GEMINI_API_KEY not found in environment.")
    exit(1)

try:
    client = genai.Client(api_key=api_key)
except Exception as e:
    print(f"Failed to initialize GenAI Client: {e}")
    exit(1)


def extract_text_from_pdf(filepath):
    try:
        import PyPDF2

        text = ""
        with open(filepath, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                if page.extract_text():
                    text += page.extract_text() + "\n"
        return text
    except ImportError:
        print("PyPDF2 not installed. Install via: pip install PyPDF2")
        return ""
    except Exception as e:
        print(f"Failed to read PDF {filepath}: {e}")
        return ""


def extract_text_from_md(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        print(f"Failed to read MD {filepath}: {e}")
        return ""


def process_documents(directory):
    # Process both PDF and MD files recursively
    pdf_files = glob.glob(os.path.join(directory, "**/*.pdf"), recursive=True)
    md_files = glob.glob(os.path.join(directory, "**/*.md"), recursive=True)
    all_files = pdf_files + md_files

    if not all_files:
        print(f"No PDF or MD files found in {directory}")
        return

    for filepath in all_files:
        filename = os.path.basename(filepath)
        ext = filename.split(".")[-1].lower()
        print(f"Processing {filename}...")

        # 1. Register Document
        doc_res = (
            supabase.table("documents")
            .insert({"name": filename, "type": ext})
            .execute()
        )

        doc_id = doc_res.data[0]["id"]

        # 2. Extract Text
        if ext == "pdf":
            text = extract_text_from_pdf(filepath)
        elif ext == "md":
            text = extract_text_from_md(filepath)
        else:
            continue

        if not text:
            print(f"No text extracted for {filename}.")
            continue

        # 3. Simple Chunking (split by double newline, filter small chunks)
        chunks = [
            chunk.strip() for chunk in text.split("\n\n") if len(chunk.strip()) > 50
        ]

        if not chunks:
            print(f"No chunks created for {filename}.")
            continue

        # 4. Generate Embeddings and Insert
        for i, chunk_text in enumerate(chunks):
            try:
                from google.genai import types

                response = client.models.embed_content(
                    model="gemini-embedding-2",
                    contents=chunk_text,
                    config=types.EmbedContentConfig(output_dimensionality=768),
                )
                vector = response.embeddings[0].values

                # Insert into document_chunks
                supabase.table("document_chunks").insert(
                    {
                        "document_id": doc_id,
                        "content": chunk_text,
                        "embedding": vector,
                        "metadata": {"chunk_index": i},
                    }
                ).execute()
            except Exception as e:
                print(f"GenAI or DB error for chunk {i}: {e}")

        # Update status
        supabase.table("documents").update({"status": "indexed"}).eq(
            "id", doc_id
        ).execute()
        print(f"Indexed {len(chunks)} chunks for {filename}.")


if __name__ == "__main__":
    demo_dir = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "demo-data")
    )
    if not os.path.exists(demo_dir):
        os.makedirs(demo_dir)
    print(f"Reading files from {demo_dir}...")
    process_documents(demo_dir)

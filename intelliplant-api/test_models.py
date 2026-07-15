from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

for model_name in ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-2.0-flash-lite", "gemini-flash-lite-latest", "gemini-2.5-pro", "gemini-flash-latest"]:
    try:
        response = client.models.generate_content(
            model=model_name,
            contents="Say hi"
        )
        print(f"SUCCESS: {model_name}")
    except Exception as e:
        print(f"FAILED: {model_name} - {str(e)}")

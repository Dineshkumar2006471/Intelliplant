from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client()
response = client.models.generate_content(
    model='gemini-1.5-flash',
    contents='Tell me a joke.'
)
print(response.text)

import vertexai
from vertexai.generative_models import GenerativeModel

try:
    print("Initializing Vertex AI...")
    vertexai.init(project="kaggle-5b-478308", location="us-central1")
    model = GenerativeModel("gemini-1.5-flash-002")
    print("Sending prompt...")
    response = model.generate_content("Hello, can you verify you are working?")
    print("Success! Response:")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")

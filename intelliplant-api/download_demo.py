import os
import urllib.request
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

demo_dir = r"c:\Users\bingi\Intelliplant\demo-data"
if not os.path.exists(demo_dir):
    os.makedirs(demo_dir)

files = {
    "Factory_Act_1948.pdf": "https://labour.gov.in/sites/default/files/TheFactoriesAct1948.pdf",
    "OISD_118_Layout.pdf": "https://www.pepsico.com/docs/default-source/sustainability-and-esg-topics/environment-health-and-safety-policy.pdf"
}

for name, url in files.items():
    path = os.path.join(demo_dir, name)
    try:
        print(f"Downloading {name}...")
        urllib.request.urlretrieve(url, path)
        print(f"Successfully downloaded {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")

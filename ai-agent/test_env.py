import os
from dotenv import load_dotenv, find_dotenv

print(f"Searching for .env from: {os.getcwd()}")
dotenv_path = find_dotenv()
print(f"Found .env at: {dotenv_path}")

load_dotenv(dotenv_path)
key = os.getenv("GOOGLE_API_KEY")

if key:
    print(f"GOOGLE_API_KEY found: {key[:5]}...{key[-5:]}")
else:
    print("GOOGLE_API_KEY NOT found")

import google.generativeai as genai

API_KEY = "AIzaSyDrO2R-0NaULs7j8sAj_WT2Tyj4z0XYvZI"

genai.configure(api_key=API_KEY)

print("Available models:")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f"  - {m.name}")

print("\nTesting gemini-pro...")
model = genai.GenerativeModel('gemini-2.5-flash')
response = model.generate_content("Say hello in one word")
print(f"Response: {response.text}")
print("\nSuccess!")
import requests
import os
import sys

# Configuration
BASE_URL = "http://localhost:8000"
IMAGE_PATH = r"node_modules\@vladmandic\face-api\demo\sample1.jpg"

def test_analyze_frame():
    print(f"Testing Emotion Detection API at {BASE_URL}/analyze")
    print(f"Using image: {IMAGE_PATH}")

    if not os.path.exists(IMAGE_PATH):
        print(f"Error: Image not found at {IMAGE_PATH}")
        return

    try:
        with open(IMAGE_PATH, 'rb') as f:
            files = {'file': (os.path.basename(IMAGE_PATH), f, 'image/jpeg')}
            response = requests.post(f"{BASE_URL}/analyze", files=files)

        if response.status_code == 200:
            data = response.json()
            print("\n--- Detection Results ---")
            print(f"Emotion: {data.get('emotion')}")
            print(f"Confidence: {data.get('confidence'):.2f}")
            print(f"Stress Level: {data.get('stressLevel')}")
            print(f"Stress Score: {data.get('stressScore'):.2f}")
            print(f"Pipeline Status: {data.get('pipeline_status')}")
            print("-------------------------")
            
            # Simple assertion for verification
            with open("results.txt", "w", encoding="utf-8") as f:
                f.write("--- Detection Results ---\n")
                f.write(f"Emotion: {data.get('emotion')}\n")
                f.write(f"Confidence: {data.get('confidence'):.2f}\n")
                f.write(f"Stress Level: {data.get('stressLevel')}\n")
                f.write(f"Stress Score: {data.get('stressScore'):.2f}\n")
                f.write(f"Pipeline Status: {data.get('pipeline_status')}\n")
                f.write("-------------------------\n")
                
                if data.get('emotion') and data.get('stressLevel'):
                    f.write("\n✅ Verification SUCCESS: Backend returned valid analysis.\n")
                    print("\n✅ Verification SUCCESS: Backend returned valid analysis.")
                else:
                    f.write("\n❌ Verification FAILED: Incomplete data received.\n")
                    print("\n❌ Verification FAILED: Incomplete data received.")
        else:
            print(f"\n❌ Error: API returned status code {response.status_code}")
            print(response.text)

    except requests.exceptions.ConnectionError:
        print(f"\n❌ Error: Could not connect to backend at {BASE_URL}. Is it running?")
    except Exception as e:
        print(f"\n❌ An error occurred: {e}")

if __name__ == "__main__":
    test_analyze_frame()

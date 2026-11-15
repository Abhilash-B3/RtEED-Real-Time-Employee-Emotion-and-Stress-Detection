import cv2
import os
import sys

def check_resources():
    print("--- RtEED Environment Verification ---")
    
    # 1. Check Python Version
    print(f"[1/3] Checking Python version: {sys.version.split()[0]}...", end=" ")
    if sys.version_info >= (3, 8):
        print("OK")
    else:
        print("FAIL (3.8+ required)")

    # 2. Check OpenCV Models (Haar Cascades)
    print("[2/3] Checking OpenCV Haar Cascades...", end=" ")
    face_path = os.path.join(cv2.data.haarcascades, 'haarcascade_frontalface_default.xml')
    if os.path.exists(face_path):
        print("OK (Found locally)")
    else:
        print("FAIL (Run 'pip install opencv-python-headless')")

    # 3. Research Dataset Documentation
    print("\n[3/3] Dataset & Model Configuration:")
    print("-------------------------------------")
    print("The RtEED logic is inspired by the following datasets:")
    print("- FER-2013 (Facial Expression Recognition)")
    print("- CK+ (Extended Cohn-Kanade)")
    print("\nTo fine-tune models with these datasets:")
    print("1. Download FER-2013 from Kaggle: https://www.kaggle.com/c/challenges-in-representation-learning-facial-expression-recognition-challenge-dataset")
    print("2. Request CK+ access: http://www.pitt.edu/~emotion/ck-spread.htm")
    print("-------------------------------------\n")

if __name__ == "__main__":
    check_resources()

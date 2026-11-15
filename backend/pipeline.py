import cv2
import numpy as np
import tensorflow as tf
import os
import requests

class RtEEDPipeline:
    def __init__(self):
        # 1. Load Haar Cascades for Face Detection (Robust & Fast)
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

        # 2. Load Emotion Model (Mini_XCEPTION specific for FER2013)
        self.model_path = "emotion_model.hdf5"
        self.model_url = "https://github.com/oarriaga/face_classification/raw/master/trained_models/emotion_models/fer2013_mini_XCEPTION.102-0.66.hdf5"
        self.emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
        
        if not os.path.exists(self.model_path):
            print(f"Downloading emotion model from {self.model_url}...")
            try:
                r = requests.get(self.model_url, allow_redirects=True)
                with open(self.model_path, 'wb') as f:
                    f.write(r.content)
                print("Model downloaded successfully.")
            except Exception as e:
                print(f"Failed to download model: {e}")
                self.model = None
                return

        try:
            self.model = tf.keras.models.load_model(self.model_path, compile=False)
            print("Emotion model loaded successfully.")
        except Exception as e:
            print(f"Failed to load model: {e}")
            self.model = None

        # Temporal smoothing/Stress logic
        self.smoothed_stress_score = 0.0
        self.alpha = 0.2
        
        self.emotion_stress_map = {
            "Neutral": 0.10,
            "Happy": 0.05,
            "Sad": 0.45,
            "Angry": 0.90,
            "Disgust": 0.70,
            "Surprise": 0.30,
            "Fear": 0.95
        }

    def extract_rois(self, frame):
        """Step 3: ROI Extraction using Haar Cascades"""
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        
        if len(faces) == 0:
            return None, None, None
        
        # Largest face
        faces = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)
        (x, y, w, h) = faces[0]
        
        # Face ROI
        face_roi = gray[y:y+h, x:x+w]
        
        # Eyes detection (optional, for metadata)
        eyes = self.eye_cascade.detectMultiScale(face_roi)
        
        return face_roi, eyes, None # Mouth ROI not strictly needed for CNN

    def classify_emotion(self, face_roi, mouth_roi):
        """Step 5: CNN-based Classification"""
        if self.model is None or face_roi is None or face_roi.size == 0:
            return "Neutral", 0.0
            
        try:
            # Preprocess for Mini_XCEPTION (64x64, grayscale, normalized 0-1)
            roi = cv2.resize(face_roi, (64, 64))
            roi = roi.astype("float") / 255.0
            roi = np.expand_dims(roi, axis=0)
            roi = np.expand_dims(roi, axis=-1)
            
            # Predict
            preds = self.model.predict(roi, verbose=0)[0]
            label_idx = np.argmax(preds)
            emotion = self.emotion_labels[label_idx]
            confidence = float(preds[label_idx])
            
            return emotion, confidence
        except Exception as e:
            print(f"Inference Error: {e}")
            return "Neutral", 0.0

    def infer_stress(self, emotion, confidence):
        """Step 6: EMA Stress Inference"""
        base_intensity = self.emotion_stress_map.get(emotion, 0.2)
        current_frame_stress = base_intensity * (0.8 + (confidence * 0.2))
        
        if self.smoothed_stress_score == 0:
            self.smoothed_stress_score = current_frame_stress
        else:
            self.smoothed_stress_score = (self.alpha * current_frame_stress) + ((1 - self.alpha) * self.smoothed_stress_score)
        
        score = self.smoothed_stress_score
        level = "High" if score > 0.7 else "Medium" if score > 0.35 else "Low"
            
        return level, float(score)

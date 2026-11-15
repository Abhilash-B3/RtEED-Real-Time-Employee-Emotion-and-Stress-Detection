
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import base64
from pipeline import RtEEDPipeline
from database import connect_to_mongo, close_mongo_connection
from auth import router as auth_router

app = FastAPI(title="RtEED Backend API")
pipeline = RtEEDPipeline()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

@app.post("/analyze")
async def analyze_frame(file: UploadFile = File(...)):
    # Read image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Preprocessing and ROI Detection
    face_roi, eyes, mouth_roi = pipeline.extract_rois(frame)
    
    if face_roi is None:
        return {"error": "No face detected"}
        
    # Emotion Classification using both overall and mouth ROI context
    emotion, confidence = pipeline.classify_emotion(face_roi, mouth_roi)
    
    # Stress Inference
    stress_level, stress_score = pipeline.infer_stress(emotion, confidence)
    
    return {
        "emotion": emotion,
        "confidence": confidence,
        "stressLevel": stress_level,
        "stressScore": min(stress_score, 1.0),
        "pipeline_status": "Success",
        "rois_detected": {
            "eyes": len(eyes) if eyes is not None else 0,
            "mouth": mouth_roi is not None
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

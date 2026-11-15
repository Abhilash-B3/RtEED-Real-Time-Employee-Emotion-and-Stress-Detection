
import * as faceapi from "@vladmandic/face-api";
import { EmotionLabel, StressLevel } from "../types";

/**
 * RtEED High-Precision Neural Engine
 * Powered by face-api.js (TensorFlow.js)
 * Industry-standard models used by millions of developers.
 */

let modelsLoaded = false;
const MODEL_URL = "https://vladmandic.github.io/face-api/model/";

export const initNeuralModels = async () => {
  if (modelsLoaded) return;
  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
    ]);
    modelsLoaded = true;
    console.log("RtEED: Neural Models Loaded Successfully");
  } catch (error) {
    console.error("RtEED: Neural Model Loading Failed", error);
    throw error;
  }
};

export const analyzeFrameLocally = async (canvas: HTMLCanvasElement) => {
  if (!modelsLoaded) {
    await initNeuralModels();
  }

  // Run Real-Time Deep Learning Inference
  // Using SSD Mobilenet v1 for high-precision face detection
  const detection = await faceapi.detectSingleFace(canvas)
    .withFaceLandmarks()
    .withFaceExpressions();

  if (!detection) {
    return {
      emotion: EmotionLabel.NEUTRAL,
      confidence: 0,
      stressLevel: StressLevel.LOW,
      stressScore: 0,
      isStable: false,
      noFace: true
    };
  }

  // Map Face-api expressions to RtEED labels
  const expressions = detection.expressions;
  // Fix: Explicitly cast the values in the sort to number to satisfy arithmetic operation requirements
  const sorted = Object.entries(expressions).sort((a, b) => (b[1] as number) - (a[1] as number));
  const primaryExpression = sorted[0][0];
  // Fix: Cast the confidence value to number so toFixed can be accessed on line 94
  const confidence = sorted[0][1] as number;

  let emotion: EmotionLabel = EmotionLabel.NEUTRAL;
  let stressScore = 0.1;

  // Professional mapping logic based on probability distributions
  switch (primaryExpression) {
    case 'happy':
      emotion = EmotionLabel.HAPPY;
      stressScore = 0.05;
      break;
    case 'sad':
      emotion = EmotionLabel.SAD;
      stressScore = 0.45;
      break;
    case 'angry':
      emotion = EmotionLabel.ANGRY;
      stressScore = 0.85;
      break;
    case 'surprised':
      emotion = EmotionLabel.SURPRISED;
      stressScore = 0.30;
      break;
    case 'fearful':
      emotion = EmotionLabel.FEAR;
      stressScore = 0.90;
      break;
    case 'disgusted':
      emotion = EmotionLabel.STRESSED;
      stressScore = 0.70;
      break;
    default:
      emotion = EmotionLabel.NEUTRAL;
      stressScore = 0.15 + (expressions.neutral < 0.5 ? 0.2 : 0);
  }

  return {
    emotion,
    // Fix: confidence is now typed as number, allowing toFixed() call
    confidence: Number(confidence.toFixed(2)),
    stressLevel: stressScore > 0.7 ? StressLevel.HIGH : stressScore > 0.35 ? StressLevel.MEDIUM : StressLevel.LOW,
    stressScore: Number(stressScore.toFixed(2)),
    isStable: true
  };
};


import { EmotionLabel, StressLevel } from "../types";

/**
 * Local Analysis Engine (Privacy-First)
 * This service simulates facial analysis locally without external API calls.
 * In a production environment, this would be replaced with a library like face-api.js or TensorFlow.js.
 */

// Helper to calculate a "pseudo-hash" from image data to provide consistent results for similar frames
const getImageSeededValue = (imageData: ImageData): number => {
  let sum = 0;
  // Sample every 100th pixel for performance
  for (let i = 0; i < imageData.data.length; i += 400) {
    sum += imageData.data[i];
  }
  return sum % 100;
};

export const analyzeFrame = async (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { emotion: EmotionLabel.NEUTRAL, confidence: 1, stressLevel: StressLevel.LOW, stressScore: 0 };

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const seed = getImageSeededValue(imageData);

  // Simulate complex logic based on the image "seed"
  // This mimics how a real model would interpret specific patterns
  let emotion: EmotionLabel;
  let stressLevel: StressLevel;
  let stressScore: number;
  let confidence: number = 0.85 + (seed / 1000);

  if (seed > 85) {
    emotion = EmotionLabel.STRESSED;
    stressLevel = StressLevel.HIGH;
    stressScore = 0.7 + (seed / 400);
  } else if (seed > 65) {
    emotion = EmotionLabel.HAPPY;
    stressLevel = StressLevel.LOW;
    stressScore = 0.1 + (seed / 1000);
  } else if (seed > 45) {
    emotion = EmotionLabel.SURPRISED;
    stressLevel = StressLevel.MEDIUM;
    stressScore = 0.4 + (seed / 500);
  } else if (seed > 25) {
    emotion = EmotionLabel.NEUTRAL;
    stressLevel = StressLevel.LOW;
    stressScore = 0.2 + (seed / 800);
  } else {
    emotion = EmotionLabel.SAD;
    stressLevel = StressLevel.MEDIUM;
    stressScore = 0.5 + (seed / 600);
  }

  // Add a slight artificial delay to mimic processing time
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    emotion,
    confidence,
    stressLevel,
    stressScore: Math.min(stressScore, 1)
  };
};

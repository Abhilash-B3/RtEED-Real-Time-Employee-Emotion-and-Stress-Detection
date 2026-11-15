
export enum UserRole {
  EMPLOYEE = 'Employee',
  ADMIN = 'Admin'
}

export interface User {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  department: string;
  role: UserRole;
  createdAt: string;
}

export enum EmotionLabel {
  HAPPY = 'Happy',
  SAD = 'Sad',
  ANGRY = 'Angry',
  NEUTRAL = 'Neutral',
  STRESSED = 'Stressed',
  SURPRISED = 'Surprised',
  FEAR = 'Fear'
}

export enum StressLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface EmotionLog {
  id: string;
  sessionId: string;
  label: EmotionLabel;
  confidence: number;
  timestamp: string;
}

export interface StressLog {
  id: string;
  sessionId: string;
  level: StressLevel;
  score: number;
  timestamp: string;
}

export interface Session {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  deviceInfo: string;
  logs: EmotionLog[];
  stressLogs: StressLog[];
}

export interface AnalysisSummary {
  id: string;
  userId: string;
  date: string;
  dominantEmotion: EmotionLabel;
  averageStressLevel: StressLevel;
  peakStressDuration: number; // in minutes
}

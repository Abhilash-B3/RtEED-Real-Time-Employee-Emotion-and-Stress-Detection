
import { EmotionLabel, StressLevel, User, UserRole } from "../types";
import { analyzeFrameLocally } from "./localEngine";

const BACKEND_URL = "http://localhost:8000";

// --- Auth Interfaces ---
export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: any; // Raw backend user object
}

// --- Auth API ---
export const registerUser = async (userData: RegisterData): Promise<User> => {
  const response = await fetch(`${BACKEND_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Registration failed');
  }

  const backendUser = await response.json();
  return mapBackendUserToFrontend(backendUser);
};

export const loginUser = async (credentials: LoginCredentials): Promise<{ user: User, token: string }> => {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }

  const data: AuthResponse = await response.json();
  return {
    user: mapBackendUserToFrontend(data.user),
    token: data.access_token
  };
};

const mapBackendUserToFrontend = (backendUser: any): User => {
  return {
    id: backendUser.id,
    employeeCode: backendUser.employee_code || `EMP-${backendUser.id.substring(0,6).toUpperCase()}`,
    name: `${backendUser.first_name} ${backendUser.last_name}`,
    email: backendUser.email,
    department: backendUser.department,
    role: backendUser.role === 'ADMIN' ? UserRole.ADMIN : UserRole.EMPLOYEE,
    createdAt: backendUser.created_at
  };
};

// --- Analysis API ---
export interface AnalysisResult {
  emotion: EmotionLabel;
  confidence: number;
  stressLevel: StressLevel;
  stressScore: number;
  pipeline_status: "Success" | "Fallback" | "Error";
  error?: string;
  diag_code?: string;
  isStable?: boolean;
}

export const analyzeFrame = async (canvas: HTMLCanvasElement): Promise<AnalysisResult> => {
  // Step 1: Try Backend (Python FER)
  try {
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg'));
    if (!blob) throw new Error("Canvas to Blob failed");

    const formData = new FormData();
    formData.append('file', blob);

    const response = await fetch(`${BACKEND_URL}/analyze`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error(`Backend Error: ${response.statusText}`);

    const data = await response.json();
    
    if (data.error) throw new Error(data.error);

    return {
      emotion: data.emotion,
      confidence: data.confidence,
      stressLevel: data.stressLevel,
      stressScore: data.stressScore,
      pipeline_status: "Success",
      isStable: true
    };
  } catch (backendError) {
    console.warn("Backend unavailable, falling back to local engine:", backendError);
    // Step 2: Fallback to Local Engine
    try {
      const localResult = await analyzeFrameLocally(canvas);
      return {
        ...localResult,
        pipeline_status: "Fallback",
        error: "Backend Offline - Using Local Mode"
      };
    } catch (localError: any) {
      return {
        emotion: EmotionLabel.NEUTRAL,
        confidence: 0,
        stressLevel: StressLevel.LOW,
        stressScore: 0,
        pipeline_status: "Error",
        error: localError.message || "All Engines Failed",
        isStable: false
      } as AnalysisResult;
    }
  }
};

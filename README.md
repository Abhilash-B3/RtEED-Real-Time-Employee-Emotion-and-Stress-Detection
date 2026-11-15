{# RtEED – Real-Time Employee Emotion and Stress Detection

RtEED is a real-time workplace wellness platform that uses computer vision and deep learning to detect human emotions from live video and infer stress levels. It combines a FastAPI backend, a React dashboard, and MongoDB-backed user management to support monitoring, analytics, and AI-assisted wellness guidance.

## 🚀 Features

*   **Real-Time Emotion Detection**: Detects facial regions and classifies emotions such as Angry, Fear, Happy, Sad, Neutral, and Surprise.
*   **Stress Inference**: Converts detected emotion confidence into a stress score and confidence level for monitoring.
*   **Live Dashboard**: Provides a modern React interface for login, registration, monitoring, history, and analytics.
*   **Session Tracking**: Stores user sessions and analytics data for later review.
*   **Authentication & Roles**: Includes user registration/login with role-based access for employees and admins.
*   **AI Wellness Guidance**: Integrates AI-based suggestions and insights for stress-aware employee support.

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Vite, TailwindCSS
*   **Backend**: Python, FastAPI, Uvicorn
*   **Computer Vision**: OpenCV, NumPy, Scikit-image, SciPy
*   **Deep Learning**: TensorFlow, Keras, Mini-XCEPTION emotion model
*   **Database**: MongoDB with Motor
*   **Security**: JWT authentication and bcrypt password hashing

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/corebrains-tech/emotion-detection.git
    cd emotion-detection
    ```

2.  **Backend Setup:**
    ```bash
    python -m venv .venv
    .\.venv\Scripts\activate
    pip install -r backend/requirements.txt
    ```

3.  **Frontend Setup:**
    ```bash
    npm install
    ```

4.  **Environment Variables (Optional):**
    Create a `.env` file if you want to override default configuration.
    Typical variables include:
    - `SECRET_KEY`
    - `MONGODB_URL`
    - `ACCESS_TOKEN_EXPIRE_MINUTES`

## ▶️ How to Run

### Backend (FastAPI Server)

Make sure MongoDB is running before starting the backend.

**PowerShell**
```powershell
cd f:\arun\pro_money\emotion detection
.\.venv\Scripts\Activate.ps1
python backend/main.py
```

**Command Prompt**
```cmd
cd f:\arun\pro_money\emotion detection
.venv\Scripts\activate.bat
python backend/main.py
```

The backend API will run at **http://localhost:8000**.

### Frontend (React + Vite)

Open a separate terminal and run:
```bash
cd f:\arun\pro_money\emotion detection
npm run dev
```

The frontend will be available at **http://localhost:5173**.

---

## 🛡️ Usage

*   Register or log in to the application.
*   Open the monitoring page and allow camera access.
*   The system will analyze the user’s face and return emotion and stress predictions.
*   Review session history and analytics from the dashboard.

## 📄 License

This project is distributed under the MIT License.

---

## 📘 Repository Architecture & System Documentation

### 1. Project Overview
RtEED is designed for workplace emotional well-being monitoring. It helps organizations understand employee affective states by combining facial analysis, stress inference, and a user-friendly dashboard. The app is built around a modular backend API that processes frames and returns predictions, while the frontend visualizes trends and session data.

### 2. Repository Structure

```text
emotion-detection/
├── backend/                 # FastAPI backend, authentication, MongoDB integration, inference pipeline
│   ├── auth.py              # Login and registration routes
│   ├── database.py          # MongoDB connection logic
│   ├── main.py              # API entry point and analysis endpoint
│   ├── models.py            # Pydantic schemas
│   └── pipeline.py          # Emotion and stress inference pipeline
├── components/              # Shared React UI components
├── pages/                   # Dashboard, monitoring, analytics, auth, and profile pages
├── services/                # Frontend services for API and analysis calls
├── App.tsx                  # Main app router and route protection
├── package.json             # Frontend scripts and dependencies
├── backend/requirements.txt # Backend Python dependencies
└── README.md                # Project documentation
```

### 3. Environment Variables

| Variable | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `SECRET_KEY` | String | Optional | Secret used for JWT token signing. |
| `MONGODB_URL` | String | Optional | MongoDB connection URL. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Number | Optional | Token lifetime in minutes. |

### 4. Dependency Analysis

**Backend**
*   `fastapi`, `uvicorn`: API server and web hosting
*   `opencv-python-headless`: Face detection and image preprocessing
*   `tensorflow`: Loads the Mini-XCEPTION emotion model
*   `motor`: Async MongoDB client
*   `passlib`, `python-jose`: Authentication and token management

**Frontend**
*   `react`, `react-dom`: UI rendering
*   `react-router-dom`: Route-based pages
*   `recharts`: Charts for analytics views
*   `@vladmandic/face-api`: Face analysis utilities

### 5. System Requirements

*   **OS**: Windows, Linux, or macOS
*   **Python**: 3.10 or newer
*   **Node.js**: 18 or newer
*   **RAM**: 4 GB minimum recommended
*   **Storage**: At least 2 GB free space

### 6. Application Flow

1.  The user logs in through the React app.
2.  The frontend sends an image frame to the backend analysis endpoint.
3.  The backend extracts face regions, classifies emotion, and infers stress level.
4.  Results are returned to the UI and stored for analytics/history views.

---

📄 Documentation updated to reflect the current RtEED emotion-detection project.
}
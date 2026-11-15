
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { User, UserRole } from './types';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import LiveMonitoring from './pages/LiveMonitoring';
import SessionHistory from './pages/SessionHistory';
import EmotionAnalytics from './pages/EmotionAnalytics';
import StressAnalytics from './pages/StressAnalytics';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Define explicit interface for PrivateRoute to fix children inference issues.
interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
  user: User | null;
  onLogout: () => void;
}

// Component defined outside of main App component to ensure proper TypeScript typing and behavior.
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles, user, onLogout }) => {
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="flex-1 flex flex-col bg-gray-50">
        <Header user={user} />
        <main className="p-4 md:p-8 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rteed_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('rteed_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rteed_user');
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        
        {/* Pass user and onLogout as explicit props to PrivateRoute */}
        <Route path="/" element={<PrivateRoute user={user} onLogout={handleLogout}><Dashboard /></PrivateRoute>} />
        <Route path="/monitoring" element={<PrivateRoute user={user} onLogout={handleLogout}><LiveMonitoring /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute user={user} onLogout={handleLogout}><SessionHistory /></PrivateRoute>} />
        <Route path="/analytics/emotion" element={<PrivateRoute user={user} onLogout={handleLogout}><EmotionAnalytics /></PrivateRoute>} />
        <Route path="/analytics/stress" element={<PrivateRoute user={user} onLogout={handleLogout}><StressAnalytics /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute user={user} onLogout={handleLogout}><Profile user={user!} onUpdate={handleLogin} /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute user={user} onLogout={handleLogout} roles={[UserRole.ADMIN]}><AdminPanel /></PrivateRoute>} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;

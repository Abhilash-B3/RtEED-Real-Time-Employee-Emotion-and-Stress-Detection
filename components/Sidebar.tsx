
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Live Monitoring', path: '/monitoring', icon: '📹' },
    { name: 'Session History', path: '/history', icon: '📜' },
    { name: 'Emotion Trends', path: '/analytics/emotion', icon: '😊' },
    { name: 'Stress Trends', path: '/analytics/stress', icon: '🧠' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  if (user.role === UserRole.ADMIN) {
    menuItems.push({ name: 'Admin Panel', path: '/admin', icon: '🛡️' });
  }

  return (
    <div className="w-64 bg-indigo-900 text-white flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">RtEED</h1>
        <p className="text-indigo-300 text-xs mt-1">Employee Emotion & Stress</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-indigo-700 text-white'
                : 'text-indigo-100 hover:bg-indigo-800'
            }`}
          >
            <span>{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-800">
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-indigo-100 hover:bg-red-600 hover:text-white transition-colors"
        >
          <span>🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

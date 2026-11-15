
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const isAiReady = !!process.env.API_KEY;

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <div>
          <h2 className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Active Session</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-gray-900">Local CV Pipeline</span>
          </div>
        </div>
        
        <div className="h-8 w-[1px] bg-gray-100"></div>

        <div>
          <h2 className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Neural Engine</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <div className={`h-2 w-2 rounded-full ${isAiReady ? 'bg-indigo-500' : 'bg-amber-400'}`}></div>
            <span className={`text-xs font-bold ${isAiReady ? 'text-indigo-600' : 'text-amber-600'}`}>
              {isAiReady ? 'AI ONLINE' : 'AI OFFLINE'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900">{user.name}</p>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-tight">{user.role} &bull; {user.department}</p>
        </div>
        <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200">
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Header;

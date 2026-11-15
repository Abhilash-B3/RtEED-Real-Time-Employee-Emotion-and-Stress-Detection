
import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const Dashboard: React.FC = () => {
  const emotionData = [
    { name: 'Happy', value: 45, color: '#10B981' },
    { name: 'Neutral', value: 30, color: '#6366F1' },
    { name: 'Stressed', value: 15, color: '#F59E0B' },
    { name: 'Angry', value: 5, color: '#EF4444' },
    { name: 'Others', value: 5, color: '#9CA3AF' },
  ];

  const weeklyStressData = [
    { day: 'Mon', stress: 20 },
    { day: 'Tue', stress: 35 },
    { day: 'Wed', stress: 45 },
    { day: 'Thu', stress: 30 },
    { day: 'Fri', stress: 25 },
  ];

  const isAiEngineActive = !!process.env.API_KEY;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-500 text-sm font-medium">Real-time organizational wellness overview.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-gray-100 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
             <div className={`h-3 w-3 rounded-full ${isAiEngineActive ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-gray-300'}`}></div>
             <span className="text-xs font-black text-gray-600 uppercase tracking-widest">
               {isAiEngineActive ? 'Gemini Ready' : 'AI Offline'}
             </span>
          </div>
          <Link 
            to="/monitoring" 
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center gap-2"
          >
            <span className="text-xl">📹</span> Start Feed
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Avg Stress Index', value: '24%', change: '↓ 5% vs last week', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Active Time', value: '12.4h', change: '8 sessions recorded', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Dominant State', value: 'Positive', change: '60% Happy / Neutral', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'AI Insights Status', value: isAiEngineActive ? 'Ready' : 'Pending', change: isAiEngineActive ? 'Neural Link Active' : 'Key Required', color: isAiEngineActive ? 'text-indigo-600' : 'text-amber-600', bg: isAiEngineActive ? 'bg-indigo-50' : 'bg-amber-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between">
            <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${stat.bg} ${stat.color} whitespace-nowrap`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col min-w-0">
          <h3 className="font-black text-gray-800 mb-8 text-sm uppercase tracking-widest">Emotion Distribution</h3>
          <div className="w-full h-[300px] min-h-[300px] relative min-w-0">
            <ResponsiveContainer width="99.9%" height="100%">
              <PieChart>
                <Pie
                  data={emotionData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {emotionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col min-w-0">
          <h3 className="font-black text-gray-800 mb-8 text-sm uppercase tracking-widest">Weekly Stress Incline</h3>
          <div className="w-full h-[300px] min-h-[300px] relative min-w-0">
            <ResponsiveContainer width="99.9%" height="100%">
              <BarChart data={weeklyStressData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#9ca3af'}} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '15px', border: 'none' }} />
                <Bar dataKey="stress" fill="#6366F1" radius={[10, 10, 10, 10]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

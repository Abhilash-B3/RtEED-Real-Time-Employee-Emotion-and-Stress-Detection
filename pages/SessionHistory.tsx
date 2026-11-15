
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface SessionRecord {
  id: string;
  date: string;
  duration: string;
  stress: string;
  emotion: string;
}

const SessionHistory: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sessions: SessionRecord[] = [
    { id: 'SES-9001', date: 'Oct 25, 2023', duration: '2h 15m', stress: 'Low', emotion: 'Happy' },
    { id: 'SES-8998', date: 'Oct 25, 2023', duration: '45m', stress: 'Med', emotion: 'Neutral' },
    { id: 'SES-8950', date: 'Oct 24, 2023', duration: '1h 30m', stress: 'Low', emotion: 'Happy' },
    { id: 'SES-8921', date: 'Oct 23, 2023', duration: '3h 10m', stress: 'High', emotion: 'Stressed' },
    { id: 'SES-8890', date: 'Oct 22, 2023', duration: '1h 05m', stress: 'Low', emotion: 'Neutral' },
  ];

  const reportEmotionData = [
    { name: 'Happy', value: 55, color: '#10B981' },
    { name: 'Neutral', value: 25, color: '#6366F1' },
    { name: 'Stressed', value: 15, color: '#F59E0B' },
    { name: 'Angry', value: 5, color: '#EF4444' },
  ];

  const reportStressTimeline = [
    { t: '0m', s: 10 }, { t: '15m', s: 12 }, { t: '30m', s: 45 },
    { t: '45m', s: 30 }, { t: '1h', s: 20 }, { t: '1h 15m', s: 15 },
    { t: '1h 30m', s: 60 }, { t: '1h 45m', s: 40 }, { t: '2h', s: 10 },
  ];

  const handleViewReport = (session: SessionRecord) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Session History</h1>
        <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
          Total Logs: {sessions.length}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Session</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Avg. Stress</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Dominant Emotion</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sessions.map((s) => (
              <tr key={s.id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-600">{s.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{s.date}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{s.duration}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    s.stress === 'Low' ? 'bg-green-100 text-green-700' :
                    s.stress === 'Med' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {s.stress}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">{s.emotion}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleViewReport(s)}
                    className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    SHOW REPORT
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-center pt-4">
        <nav className="flex space-x-2">
          <button className="px-4 py-2 text-sm font-bold text-gray-400 border rounded-lg hover:bg-gray-50">Prev</button>
          <button className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg shadow-md">1</button>
          <button className="px-4 py-2 text-sm font-bold text-gray-600 border rounded-lg hover:bg-gray-50">2</button>
          <button className="px-4 py-2 text-sm font-bold text-gray-600 border rounded-lg hover:bg-gray-50">Next</button>
        </nav>
      </div>

      {isModalOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-indigo-900 p-6 flex justify-between items-center text-white">
              <div>
                <h2 className="text-xl font-black flex items-center gap-2">
                  <span>📄</span> Detailed Analysis Report
                </h2>
                <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mt-1">
                  ID: {selectedSession.id} • {selectedSession.date}
                </p>
              </div>
              <button 
                onClick={closeModal}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Session Duration</p>
                  <p className="text-2xl font-black text-indigo-900">{selectedSession.duration}</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Avg Stress Intensity</p>
                  <p className={`text-2xl font-black ${selectedSession.stress === 'High' ? 'text-red-500' : 'text-green-500'}`}>
                    {selectedSession.stress === 'High' ? '68%' : selectedSession.stress === 'Med' ? '38%' : '12%'}
                  </p>
                </div>
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Dominant State</p>
                  <p className="text-2xl font-black text-indigo-600">{selectedSession.emotion}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col min-w-0">
                  <h3 className="font-black text-gray-800 mb-6 text-sm uppercase tracking-tight">Emotional Distribution</h3>
                  <div className="h-64 relative min-w-0">
                    <ResponsiveContainer width="99.9%" height="100%">
                      <PieChart>
                        <Pie
                          data={reportEmotionData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {reportEmotionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col min-w-0">
                  <h3 className="font-black text-gray-800 mb-6 text-sm uppercase tracking-tight">Stress Temporal Incline</h3>
                  <div className="h-64 relative min-w-0">
                    <ResponsiveContainer width="99.9%" height="100%">
                      <LineChart data={reportStressTimeline}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="t" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                        <Line type="monotone" dataKey="s" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-6 py-2 text-xs font-black text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
              >
                CLOSE REPORT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionHistory;

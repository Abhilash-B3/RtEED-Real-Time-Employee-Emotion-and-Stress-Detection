
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar } from 'recharts';

const StressAnalytics: React.FC = () => {
  const stressData = [
    { day: 'Mon', morning: 20, afternoon: 40, evening: 15 },
    { day: 'Tue', morning: 30, afternoon: 50, evening: 20 },
    { day: 'Wed', morning: 40, afternoon: 70, evening: 30 },
    { day: 'Thu', morning: 25, afternoon: 35, evening: 10 },
    { day: 'Fri', morning: 15, afternoon: 25, evening: 5 },
  ];

  const timelineData = [
    { time: '9am', stress: 10 },
    { time: '10am', stress: 15 },
    { time: '11am', stress: 45 },
    { time: '12pm', stress: 60 },
    { time: '1pm', stress: 30 },
    { time: '2pm', stress: 25 },
    { time: '3pm', stress: 55 },
    { time: '4pm', stress: 40 },
    { time: '5pm', stress: 20 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Stress Pattern Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col min-w-0">
          <h3 className="font-bold text-gray-800 mb-6">Intraday Stress Intensity</h3>
          <div className="h-80 w-full relative min-w-0">
            <ResponsiveContainer width="99.9%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <ReferenceLine y={50} label="High Stress Threshold" stroke="red" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="stress" stroke="#6366F1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4">Stress Intensity Breakdown</h3>
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-100 rounded-xl">
              <span className="text-4xl font-black text-indigo-600">32%</span>
              <span className="text-xs font-bold text-gray-500 uppercase mt-1">Average Stress Intensity</span>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Level Distribution</p>
              <div className="flex h-4 w-full rounded-full overflow-hidden">
                <div className="bg-green-500 w-[60%]"></div>
                <div className="bg-yellow-500 w-[30%]"></div>
                <div className="bg-red-500 w-[10%]"></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                <span>Low</span>
                <span>Med</span>
                <span>High</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <p className="text-xs text-gray-500 leading-relaxed italic">
                Stress detection uses Gabor filter-based texture feature extraction from the eye and mouth regions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col min-w-0">
        <h3 className="font-bold text-gray-800 mb-6">Weekly Comparison (Morning vs Afternoon)</h3>
        <div className="h-64 w-full relative min-w-0">
          <ResponsiveContainer width="99.9%" height="100%">
            <BarChart data={stressData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="morning" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="afternoon" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StressAnalytics;

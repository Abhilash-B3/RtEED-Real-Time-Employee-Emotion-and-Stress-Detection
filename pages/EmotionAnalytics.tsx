
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GoogleGenAI } from "@google/genai";

const EmotionAnalytics: React.FC = () => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [groundingLinks, setGroundingLinks] = useState<{title: string, uri: string}[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  const trendData = [
    { time: '09:00', happy: 20, neutral: 60, stressed: 10, angry: 10 },
    { time: '10:00', happy: 40, neutral: 50, stressed: 5, angry: 5 },
    { time: '11:00', happy: 60, neutral: 30, stressed: 5, angry: 5 },
    { time: '12:00', happy: 30, neutral: 40, stressed: 20, angry: 10 },
    { day_phase: 'Peak Stress', time: '13:00', happy: 10, neutral: 40, stressed: 40, angry: 10 },
    { time: '14:00', happy: 50, neutral: 30, stressed: 10, angry: 10 },
    { time: '15:00', happy: 70, neutral: 20, stressed: 5, angry: 5 },
    { time: '16:00', happy: 40, neutral: 40, stressed: 15, angry: 5 },
    { time: '17:00', happy: 20, neutral: 60, stressed: 15, angry: 5 },
  ];

  useEffect(() => {
    const fetchAiSummary = async () => {
      if (isLoadingAi) return;
      
      if (!process.env.API_KEY) {
        setErrorState("Neural Engine deactivated: No API key found in environment.");
        return;
      }

      setIsLoadingAi(true);
      setErrorState(null);
      
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `
          Task: Behavioral analysis of hourly employee emotion patterns.
          Data: ${trendData.map(d => `${d.time}: H:${d.happy}% N:${d.neutral}% S:${d.stressed}%`).join('; ')}.
          Requirements:
          1. Identify the primary stress trigger window.
          2. Use Google Search to find one science-backed workplace relaxation micro-habit.
          3. Deliver a 3-sentence executive summary.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-1.5-pro',
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }]
          }
        });

        if (response.text) {
          setAiSummary(response.text);
          const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
          if (chunks) {
            const links = chunks
              .filter((c: any) => c.web)
              .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
            setGroundingLinks(links);
          }
        }
      } catch (error: any) {
        console.error("Gemini AI Engine Error:", error);
        setErrorState(`Neural Link Error: ${error.message || 'Check network connectivity'}`);
        setAiSummary("Peak stress observed during the post-lunch hour (13:00). Organizational wellness remains stable overall.");
      } finally {
        setIsLoadingAi(false);
      }
    };

    fetchAiSummary();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Behavioral Analytics</h1>
          <p className="text-gray-500 text-sm font-medium">Aggregated emotional trends across organization.</p>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col min-w-0">
        <h3 className="font-black text-gray-800 mb-8 text-sm uppercase tracking-widest">Diurnal Emotional Flux</h3>
        <div className="w-full h-[400px] min-h-[400px] relative min-w-0">
          <ResponsiveContainer width="99.9%" height="100%">
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#9ca3af'}} />
              <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#9ca3af'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }} 
              />
              <Area type="monotone" dataKey="happy" stackId="1" stroke="#10B981" strokeWidth={3} fill="#10B981" fillOpacity={0.4} />
              <Area type="monotone" dataKey="neutral" stackId="1" stroke="#6366F1" strokeWidth={3} fill="#6366F1" fillOpacity={0.4} />
              <Area type="monotone" dataKey="stressed" stackId="1" stroke="#F59E0B" strokeWidth={3} fill="#F59E0B" fillOpacity={0.4} />
              <Area type="monotone" dataKey="angry" stackId="1" stroke="#EF4444" strokeWidth={3} fill="#EF4444" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-800 mb-6 text-sm uppercase tracking-widest">Aggregate Sentiment</h3>
          <div className="space-y-6">
            {[
              { label: 'Positive Resonance', val: '65%', color: 'bg-emerald-500', text: 'text-emerald-600' },
              { label: 'Neutral Baseline', val: '25%', color: 'bg-indigo-500', text: 'text-indigo-600' },
              { label: 'Tension Alert', val: '10%', color: 'bg-rose-500', text: 'text-rose-600' }
            ].map((row, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] mb-2 items-center">
                  <span className="text-gray-400 font-black uppercase tracking-widest">{row.label}</span>
                  <span className={`font-black ${row.text} text-sm`}>{row.val}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${row.color} h-2 rounded-full transition-all duration-1000`} style={{ width: row.val }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-950 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {isLoadingAi ? 'Neural Processing...' : 'AI Strategic Insight'}
            </span>
          </div>
          
          {isLoadingAi ? (
            <div className="space-y-4">
              <div className="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
              <div className="h-4 bg-white/5 rounded-full w-[90%] animate-pulse"></div>
              <div className="h-4 bg-white/5 rounded-full w-[40%] animate-pulse"></div>
            </div>
          ) : errorState ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 opacity-50">
              <span className="text-2xl">⚠️</span>
              <p className="text-xs font-bold uppercase text-rose-300 tracking-widest">{errorState}</p>
              <p className="text-[10px] text-indigo-200">System falling back to local heuristic reporting.</p>
            </div>
          ) : (
            <div className="space-y-6 flex-1">
              <p className="text-base text-indigo-50 leading-relaxed font-medium italic">"{aiSummary}"</p>
              {groundingLinks.length > 0 && (
                <div className="pt-6 border-t border-white/10">
                   <p className="text-[9px] font-black text-indigo-400 uppercase mb-3">Grounding Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {groundingLinks.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2"
                      >
                        🔗 {link.title.substring(0, 25)}...
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmotionAnalytics;

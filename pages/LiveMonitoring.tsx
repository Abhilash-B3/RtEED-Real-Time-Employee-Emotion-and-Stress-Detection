
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { analyzeFrame, AnalysisResult } from '../services/apiService';
import { EmotionLabel, StressLevel, EmotionLog } from '../types';
import { GoogleGenAI, Chat } from "@google/genai";
import { initNeuralModels } from '../services/localEngine';

const LiveMonitoring: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  const lastAlertTimeRef = useRef<number>(0);
  const lastAlertEmotionRef = useRef<string>("");

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isModelsLoading, setIsModelsLoading] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [currentStress, setCurrentStress] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [stressScore, setStressScore] = useState(0);
  const [logs, setLogs] = useState<EmotionLog[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [isStable, setIsStable] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const [sysHealth, setSysHealth] = useState({
    camera: 'idle',
    backend: 'waiting',
    latency: 0,
    engine: 'Local CNN'
  });

  // Load Models on Mount
  useEffect(() => {
    const load = async () => {
      try {
        await initNeuralModels();
        setIsModelsLoading(false);
      } catch (err) {
        console.error("Model load failed", err);
      }
    };
    load();
  }, []);

  // Audio Context initialization on first interaction
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playDetectionBeep = (freq = 880, duration = 0.08) => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  useEffect(() => {
    if (isMonitoring && !chatSession) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const newChat = ai.chats.create({
        model: 'gemini-1.5-flash',
        config: {
          systemInstruction: `You are a Workplace Wellness Coach. 
          Respond ONLY when stress is high (>0.75). Give ONE specific grounding tip. 
          Keep it under 30 words. Do not repeat advice in the same session.`,
        },
      });
      setChatSession(newChat);
    }
  }, [isMonitoring, chatSession]);

  useEffect(() => {
    const triggerAiAdvice = async () => {
      const now = Date.now();
      const minInterval = 45000;
      
      const isNewHighStress = stressScore > 0.78;
      const emotionChanged = currentEmotion !== lastAlertEmotionRef.current;
      const cooldownPassed = (now - lastAlertTimeRef.current) > minInterval;

      if (isNewHighStress && chatSession && !isAiThinking && (emotionChanged || cooldownPassed)) {
        setIsAiThinking(true);
        setShowAiAssistant(true);
        lastAlertTimeRef.current = now;
        lastAlertEmotionRef.current = currentEmotion || "";

        try {
          const response = await chatSession.sendMessage({ 
            message: `Current Stress: ${Math.round(stressScore * 100)}% (State: ${currentEmotion}). Suggest a quick relief exercise.` 
          });
          setChatMessages(prev => [...prev, { role: 'model', text: response.text || "Detected tension. Take a slow breath." }]);
        } catch (err) {
          console.error("Coach Error:", err);
        } finally {
          setIsAiThinking(false);
        }
      }
    };
    triggerAiAdvice();
  }, [stressScore, chatSession, currentEmotion]);

  const startCamera = async () => {
    initAudio();
    setSysHealth(prev => ({ ...prev, camera: 'initializing' }));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          aspectRatio: { ideal: 1.777777778 },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsMonitoring(true);
      setSysHealth(prev => ({ ...prev, camera: 'active' }));
    } catch (err) {
      setSysHealth(prev => ({ ...prev, camera: 'failed' }));
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsMonitoring(false);
    setCurrentEmotion(null);
    setStressScore(0);
    setChatMessages([]);
    setChatSession(null);
    setShowAiAssistant(false);
    lastAlertTimeRef.current = 0;
    lastAlertEmotionRef.current = "";
    setSysHealth({ camera: 'idle', backend: 'waiting', latency: 0, engine: 'Local CNN' });
  };

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isMonitoring || isModelsLoading) return;
    setIsAnalyzing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const startTime = performance.now();
    const result = await analyzeFrame(canvas);
    const endTime = performance.now();
    
    setSysHealth(prev => ({ 
      ...prev, 
      backend: result.pipeline_status === 'Success' ? 'online' : 'fallback',
      latency: Math.round(endTime - startTime),
      engine: result.pipeline_status === 'Success' ? 'Python Gabor' : 'Neural TFJS'
    }));

    setCurrentEmotion(result.emotion);
    setConfidence(result.confidence);
    setCurrentStress(result.stressLevel);
    setStressScore(result.stressScore);
    setIsStable(!(result as any).isUnstable);

    // BEEP LOGIC: Precise Sync with Neural Pass
    if (!(result as any).noFace) {
       if (result.emotion === EmotionLabel.NEUTRAL) {
        playDetectionBeep(440, 0.05);
      } else {
        playDetectionBeep(880, 0.1);
        setLogs(prev => [{
          id: Math.random().toString(36).substr(2, 9),
          sessionId: 'current',
          label: result.emotion as EmotionLabel,
          confidence: result.confidence,
          timestamp: new Date().toISOString()
        }, ...prev].slice(0, 15));
      }
    }
    
    setIsAnalyzing(false);
  }, [isMonitoring, isMuted, isModelsLoading]);

  useEffect(() => {
    let interval: number;
    if (isMonitoring) interval = window.setInterval(captureAndAnalyze, 1000); 
    return () => clearInterval(interval);
  }, [isMonitoring, captureAndAnalyze]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (isModelsLoading) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest animate-pulse">Initializing Neural Models...</p>
        <p className="text-[10px] text-gray-400">Loading industry-standard FaceExpressionNet weights.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[calc(100vh-120px)] animate-in fade-in duration-700">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Live Session</h1>
          <div className="flex gap-4 mt-2">
             <span className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-100">
               <div className={`h-2 w-2 rounded-full ${isStable ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
               Tracking: {isStable ? 'Stable' : 'Calibrating'}
             </span>
             <span className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-100">
               <div className={`h-2 w-2 rounded-full bg-indigo-500`}></div>
               Active Engine: {sysHealth.engine}
             </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black border transition-all ${isMuted ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-white text-gray-600'}`}
          >
            {isMuted ? '🔇 Audio Off' : '🔊 Audio On'}
          </button>
          {isMonitoring && (
            <button
              onClick={() => setShowAiAssistant(!showAiAssistant)}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black transition-all ${showAiAssistant ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border'}`}
            >
              Coach: {isAiThinking ? 'Thinking...' : 'Observing'}
            </button>
          )}
          {!isMonitoring ? (
            <button onClick={startCamera} className="bg-indigo-600 text-white px-8 py-2.5 rounded-2xl font-black shadow-xl">START FEED</button>
          ) : (
            <button onClick={stopCamera} className="bg-rose-600 text-white px-8 py-2.5 rounded-2xl font-black shadow-xl">END SESSION</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[550px]">
        <div className={`${showAiAssistant ? 'lg:col-span-8' : 'lg:col-span-9'} bg-black rounded-[2.5rem] overflow-hidden relative shadow-2xl border-4 border-white transition-all`}>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-contain transform scale-x-[-1]" 
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {isMonitoring && currentEmotion && (
            <div className="absolute bottom-8 left-8 flex items-end gap-4">
              <div className={`bg-black/60 backdrop-blur-xl px-6 py-4 rounded-[2rem] border-2 ${currentEmotion === 'Happy' ? 'border-emerald-400' : 'border-white/10'} text-white shadow-2xl`}>
                <p className="text-[10px] uppercase text-indigo-300 font-black mb-1">Neural Detection</p>
                <span className="text-3xl font-black">{currentEmotion}</span>
              </div>
            </div>
          )}

          {/* Activity Indicator */}
          {isMonitoring && (
            <div className="absolute top-8 left-8 flex items-center gap-3">
               <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <div className={`h-1.5 w-1.5 rounded-full ${isAnalyzing ? 'bg-green-400 animate-ping' : 'bg-green-500'}`}></div>
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">Deep Learning Sync</span>
               </div>
            </div>
          )}
        </div>

        <div className={`${showAiAssistant ? 'lg:col-span-4' : 'lg:col-span-3'} flex flex-col gap-6 transition-all min-w-0`}>
          {showAiAssistant ? (
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl flex flex-col h-full overflow-hidden">
              <div className="p-6 bg-indigo-950 text-white">
                <span className="text-xs font-black uppercase tracking-widest">Wellness Coach AI</span>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {chatMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                    <p className="text-xs font-black uppercase">Monitoring Expressions...</p>
                    <p className="text-[10px] mt-2 italic">Coach intervenes only during sustained high stress.</p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'model' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[90%] p-4 rounded-2xl text-xs font-medium ${msg.role === 'model' ? 'bg-indigo-50 text-indigo-950' : 'bg-indigo-600 text-white'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>
          ) : (
            <>
              <div className={`p-8 rounded-[2.5rem] shadow-xl transition-colors duration-500 ${stressScore > 0.7 ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'}`}>
                <h4 className="text-[10px] font-black uppercase mb-6">Real-Time Stress Score</h4>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-6xl font-black">{(stressScore * 100).toFixed(0)}</span>
                  <span className="text-xl opacity-40">%</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-3">
                  <div className="bg-white h-full rounded-full transition-all duration-700" style={{ width: `${stressScore * 100}%` }}></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex-1 overflow-hidden flex flex-col min-w-0">
                <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4">Neural Log Flow</h3>
                <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1">
                  {logs.length === 0 && <p className="text-center py-10 text-[10px] font-black text-gray-200 uppercase">Awaiting Inference</p>}
                  {logs.map(log => (
                    <div key={log.id} className="flex justify-between p-3 bg-gray-50 rounded-xl">
                      <span className={`font-bold text-xs ${log.label === 'Happy' ? 'text-emerald-600' : 'text-gray-700'}`}>{log.label}</span>
                      <span className="text-[9px] text-gray-400">{(log.confidence * 100).toFixed(0)}% Certainty</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoring;

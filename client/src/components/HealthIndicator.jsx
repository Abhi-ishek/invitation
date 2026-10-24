import React, { useState, useEffect } from 'react';
import { videoService } from '../services/videoService';
import { Activity, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function HealthIndicator() {
  const [health, setHealth] = useState(null);
  const [status, setStatus] = useState('checking'); // 'checking' | 'connected' | 'offline'

  const checkHealth = async () => {
    try {
      const res = await videoService.getHealth();
      setHealth(res.data);
      setStatus('connected');
    } catch {
      setStatus('offline');
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full border border-gold/20 bg-maroon-dark/60 backdrop-blur-sm">
      {status === 'connected' ? (
        <>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-300 font-medium hidden sm:inline">Server Active</span>
          <span className="text-[10px] text-gold-light/70 hidden lg:inline">
            ({health?.database?.status === 'connected' ? 'DB Online' : 'Resilient API'})
          </span>
        </>
      ) : status === 'checking' ? (
        <>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-200">Checking API...</span>
        </>
      ) : (
        <>
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          <span className="text-rose-300">Server Offline</span>
        </>
      )}
    </div>
  );
}

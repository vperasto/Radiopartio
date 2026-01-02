import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Lock, Wifi } from 'lucide-react';

interface PTTButtonProps {
  onSuccess: () => void;
  onFail: (reason: string) => void;
}

const PTTButton: React.FC<PTTButtonProps> = ({ onSuccess, onFail }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const HOLD_DURATION = 1200; // ms to wait before speaking

  const handlePointerDown = () => {
    setIsHolding(true);
    setIsReady(false);
    setProgress(0);

    // Start progress animation
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const p = Math.min((elapsed / HOLD_DURATION) * 100, 100);
        setProgress(p);
    }, 16);

    // Set success timer
    timerRef.current = setTimeout(() => {
      setIsReady(true);
    }, HOLD_DURATION);
  };

  const handlePointerUp = () => {
    // Clear timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    setIsHolding(false);

    if (isReady) {
      onSuccess();
    } else {
      setProgress(0);
      onFail("Puhuit liian aikaisin! Viesti leikkaantui.");
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 select-none">
      <div className="relative">
        {/* Status Light */}
        <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest ${isReady && isHolding ? 'text-emerald-400' : isHolding ? 'text-amber-500' : 'text-slate-500'}`}>
             {isReady && isHolding ? (
                 <><Wifi className="animate-pulse" size={14}/> LÄHETYS</>
             ) : isHolding ? (
                 <><Lock className="animate-spin" size={14} /> ODOTA...</>
             ) : (
                 <>VALMIUSTILA</>
             )}
        </div>

        <motion.button
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => isHolding && handlePointerUp()} // Handle dragging finger off
          whileTap={{ scale: 0.95 }}
          className={`
            relative w-48 h-48 rounded-sm border-2 flex flex-col items-center justify-center
            transition-all duration-200 touch-none
            ${isHolding 
                ? 'bg-slate-800 border-slate-500' 
                : 'bg-slate-900 border-slate-600 hover:border-slate-500'
            }
          `}
        >
          {/* Progress Bar Background */}
          <div 
            className="absolute bottom-0 left-0 h-full bg-slate-800/50 z-0 transition-all duration-75 ease-linear"
            style={{ width: '100%', height: `${progress}%`, opacity: 0.3 }}
          ></div>

          {/* Icon */}
          <div className="z-10 relative">
            <Mic 
                size={48} 
                className={`transition-colors duration-300 ${isReady && isHolding ? 'text-emerald-500' : isHolding ? 'text-amber-500' : 'text-slate-600'}`} 
            />
          </div>
          
          <div className="z-10 mt-4 text-xs font-mono text-slate-500 uppercase tracking-widest">
            {isHolding ? "PIDÄ POHJASSA" : "PAINA"}
          </div>

          {/* Tactical Corners */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-slate-500"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-slate-500"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-slate-500"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-slate-500"></div>
        </motion.button>
      </div>

      <p className="mt-8 text-center text-xs text-slate-400 max-w-xs mx-auto">
        1. Paina nappia <br/>
        2. Odota kunnes valo on <span className="text-emerald-500">VIHREÄ</span> <br/>
        3. Vapauta puhuaksesi
      </p>
    </div>
  );
};

export default PTTButton;
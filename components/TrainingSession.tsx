
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Battery, ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { Callsign } from '../types';
import { RANKS } from '../constants';
import IdentityCard from './IdentityCard';
import ManualContent from './ManualContent';
import GameContent from './GameContent';

interface TrainingSessionProps {
  callsign: Callsign;
  currentUser: string;
  passedGamesCount: number;
  hasCompletedBefore: boolean;
  onGameComplete: (score: number, totalQuestions: number) => void;
  onExit: () => void;
}

type Phase = 'MANUAL' | 'GAME';

const TrainingSession: React.FC<TrainingSessionProps> = ({
  callsign,
  currentUser,
  passedGamesCount,
  hasCompletedBefore,
  onGameComplete,
  onExit
}) => {
  const [phase, setPhase] = useState<Phase>('MANUAL');
  
  // HUD State (lifted from children)
  const [status, setStatus] = useState({
      title: "LADATAAN",
      subtitle: "...",
      progress: "0/0",
      isComplete: false,
      canGoBack: false
  });

  // Navigation Triggers
  const [triggerNext, setTriggerNext] = useState(false);
  const [triggerPrev, setTriggerPrev] = useState(false);

  const currentRank = [...RANKS].reverse().find(r => passedGamesCount >= r.minPassed) || RANKS[0];

  const handleStatusUpdate = useCallback((newStatus: any) => {
    setStatus(newStatus);
  }, []);

  const handleNextClick = () => {
    setTriggerNext(true);
  };

  const handlePrevClick = () => {
      if (status.canGoBack) {
        setTriggerPrev(true);
      } else if (phase === 'MANUAL') {
          // If on first page of manual, exit
          onExit();
      }
  };

  const handleConsumedTrigger = useCallback(() => {
      setTriggerNext(false);
      setTriggerPrev(false);
  }, []);

  const handleManualComplete = () => {
      setPhase('GAME');
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-950 text-slate-200 overflow-hidden font-mono selection:bg-emerald-500 selection:text-slate-900">
      
      {/* 1. TACTICAL HUD HEADER */}
      <div className="shrink-0 h-14 w-full px-4 border-b border-slate-700 bg-slate-900 z-20 flex justify-between items-center shadow-md relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:4px_4px] pointer-events-none"></div>

        <div className="flex items-center gap-4 z-10">
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase leading-none mb-0.5">TASO: {currentRank.title}</span>
                <span className="text-emerald-500 font-bold tracking-widest leading-none text-sm">{callsign}</span>
            </div>
            <div className="hidden md:flex h-6 w-px bg-slate-700"></div>
            <div className="hidden md:flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase leading-none mb-0.5">{status.title}</span>
                <span className="text-emerald-500/80 text-[10px] leading-none animate-pulse">ONLINE // SECURE</span>
            </div>
        </div>

        <div className="flex items-center gap-3 z-10">
             <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded-sm border border-slate-700">
                <BookOpen size={12} className="text-slate-400" />
                <span className="text-xs text-slate-300 font-bold">
                    {status.progress}
                </span>
            </div>
            <Battery size={16} className="text-emerald-500 hidden md:block" />
        </div>
      </div>

      {/* 2. MAIN GRID LAYOUT */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-2 md:p-6 relative min-h-0 overflow-hidden">
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 relative">
            
            {/* 
               IDENTITY CARD (Persistent)
               - Uses `layout` prop to animate grid position change.
               - Manual Mode: Col 3 (Right)
               - Game Mode: Col 1 (Left)
            */}
            <motion.div 
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`hidden lg:block h-full min-h-0 z-10 ${phase === 'MANUAL' ? 'lg:col-start-3 lg:row-start-1' : 'lg:col-start-1 lg:row-start-1'}`}
            >
                <IdentityCard 
                    currentUser={currentUser}
                    callsign={callsign}
                    passedGamesCount={passedGamesCount}
                    isReadOnly={phase === 'GAME'}
                />
            </motion.div>

            {/* 
               MAIN CONTENT AREA
               - Slides content in/out based on phase.
               - Manual Mode: Cols 1-2 (Left)
               - Game Mode: Cols 2-3 (Right)
            */}
            <motion.div 
                layout
                className={`col-span-1 lg:col-span-2 h-full min-h-0 relative ${phase === 'MANUAL' ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-2 lg:row-start-1'}`}
            >
               <AnimatePresence mode="popLayout" initial={false}>
                  {phase === 'MANUAL' ? (
                      <motion.div 
                        key="manual-wrapper"
                        className="h-full w-full"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                         <ManualContent 
                            onStatusUpdate={handleStatusUpdate}
                            triggerNext={triggerNext}
                            triggerPrev={triggerPrev}
                            onConsumedTrigger={handleConsumedTrigger}
                            onComplete={handleManualComplete}
                            passedGamesCount={passedGamesCount} // NEW PROP
                         />
                      </motion.div>
                  ) : (
                      <motion.div 
                        key="game-wrapper"
                        className="h-full w-full"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }} // Delay slightly to let ID card move
                      >
                         <GameContent 
                            callsign={callsign}
                            onStatusUpdate={handleStatusUpdate}
                            triggerNext={triggerNext}
                            onConsumedTrigger={handleConsumedTrigger}
                            onGameComplete={onGameComplete}
                            passedGamesCount={passedGamesCount} // NEW PROP
                         />
                      </motion.div>
                  )}
               </AnimatePresence>
            </motion.div>

        </div>
      </div>

      {/* 3. FOOTER (Persistent) */}
      <div className="shrink-0 p-3 md:p-4 bg-slate-950 border-t border-slate-800 w-full z-20 flex gap-2 md:gap-4 items-center justify-between">
        
        {/* PREVIOUS BUTTON */}
        <button
            onClick={handlePrevClick}
            disabled={!status.canGoBack && phase === 'GAME'} // Can always go back in Manual (to exit), but not Game
            className={`
                h-12 md:h-14 w-12 md:w-auto px-0 md:px-6 flex items-center justify-center gap-2
                font-mono font-bold uppercase tracking-widest text-sm md:text-base transition-all duration-200
                border rounded-sm
                ${(!status.canGoBack && phase === 'GAME')
                    ? 'opacity-0 pointer-events-none' 
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200 hover:bg-slate-800'
                }
            `}
        >
            <ArrowLeft size={18} />
            <span className="hidden md:inline">EDELLINEN</span>
        </button>

        {/* FAST TRACK (Skip Manual) */}
        {phase === 'MANUAL' && hasCompletedBefore && !status.isComplete && (
             <button
                onClick={() => setPhase('GAME')}
                className="
                    h-12 md:h-14 px-4 md:px-6 flex items-center justify-center gap-2
                    font-mono font-bold uppercase tracking-widest text-xs md:text-sm transition-all duration-200
                    border border-emerald-900/50 bg-emerald-900/10 text-emerald-500 hover:bg-emerald-900/20 hover:border-emerald-500/50 rounded-sm
                "
            >
                <SkipForward size={16} />
                <span className="hidden sm:inline">OHITA (ALOITA KOE)</span>
                <span className="sm:hidden">KOE</span>
            </button>
        )}

        {/* NEXT / START BUTTON */}
        {phase === 'MANUAL' && (
            <button
                onClick={handleNextClick}
                className={`
                    h-12 md:h-14 px-4 md:px-8 flex items-center justify-center gap-2
                    font-mono font-bold uppercase tracking-widest text-sm md:text-base transition-all duration-200
                    border rounded-sm shadow-lg relative overflow-hidden group
                    ${status.isComplete 
                        ? 'bg-emerald-600/90 border-emerald-400 text-white hover:bg-emerald-500' 
                        : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-400'
                    }
                `}
            >
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1s_infinite]"></div>
                
                <span>{status.isComplete ? 'ALOITA KOE' : 'SEURAAVA'}</span>
                <ArrowRight size={20} className={status.isComplete ? "animate-pulse" : ""} />
            </button>
        )}
        
        {phase === 'GAME' && <div className="w-12 md:w-auto px-6"></div>}

      </div>
    </div>
  );
};

export default TrainingSession;

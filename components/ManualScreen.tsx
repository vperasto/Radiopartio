import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Mic, ShieldAlert, Siren, ArrowRight, ArrowLeft, BookOpen, CheckCircle2, Wifi, ScanLine, Battery, SkipForward } from 'lucide-react';
import { MANUAL_PAGES, RADIO_FACTS, RANKS } from '../constants';
import { Callsign } from '../types';
import IdentityCard from './IdentityCard';

interface ManualScreenProps {
  callsign: Callsign;
  currentUser: string;
  onComplete: () => void;
  hasCompletedBefore?: boolean;
  passedGamesCount: number;
}

const iconMap: Record<string, React.ElementType> = {
  Radio,
  Mic,
  ShieldAlert,
  Siren,
  CheckCircle2,
  Wifi
};

const ManualScreen: React.FC<ManualScreenProps> = ({ callsign, currentUser, onComplete, hasCompletedBefore, passedGamesCount }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [randomFact, setRandomFact] = useState<string>('');
  
  useEffect(() => {
    const fact = RADIO_FACTS[Math.floor(Math.random() * RADIO_FACTS.length)];
    setRandomFact(fact);
  }, []);

  // Rank Logic for Header
  const currentRank = [...RANKS].reverse().find(r => passedGamesCount >= r.minPassed) || RANKS[0];

  const currentPage = MANUAL_PAGES[pageIndex];
  const isLastPage = pageIndex === MANUAL_PAGES.length - 1;
  const ContentIcon = iconMap[currentPage.icon] || Radio;

  const handleNext = () => {
    if (isLastPage) {
      onComplete();
    } else {
      setPageIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (pageIndex > 0) {
      setPageIndex(prev => prev - 1);
    }
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
                <span className="text-[10px] text-slate-500 font-bold uppercase leading-none mb-0.5">STATUS</span>
                <span className="text-emerald-500/80 text-[10px] leading-none animate-pulse">ONLINE // SECURE</span>
            </div>
        </div>

        <div className="flex items-center gap-3 z-10">
             <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded-sm border border-slate-700">
                <BookOpen size={12} className="text-slate-400" />
                <span className="text-xs text-slate-300 font-bold">
                    {pageIndex + 1}<span className="text-slate-500">/</span>{MANUAL_PAGES.length}
                </span>
            </div>
            <Battery size={16} className="text-emerald-500 hidden md:block" />
        </div>
      </div>

      {/* 2. MAIN DISPLAY AREA */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-2 md:p-6 relative min-h-0 overflow-hidden">
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            
            {/* LEFT COLUMN: MANUAL (Takes 2/3 on desktop) - This slides out to LEFT */}
            <motion.div 
                className="lg:col-span-2 flex flex-col h-full min-h-0 relative z-0"
                initial={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={currentPage.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 flex flex-col w-full h-full"
                    >
                        <div className="flex-1 border-2 border-slate-700 bg-slate-900/50 rounded-sm relative flex flex-col overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                            {/* Decorative Corners */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-500/50 z-20"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-500/50 z-20"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-500/50 z-20"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-500/50 z-20"></div>

                            {/* Scanlines */}
                            <div className="absolute inset-0 pointer-events-none z-0 opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

                            {/* Manual Content Header */}
                            <div className="shrink-0 p-4 flex items-center gap-4 border-b border-slate-700/50 bg-slate-800/30 z-10 backdrop-blur-sm">
                                <div className="w-10 h-10 md:w-14 md:h-14 rounded-sm border border-emerald-500/30 bg-slate-900 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                    <ContentIcon className="text-emerald-400 w-5 h-5 md:w-8 md:h-8" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] md:text-xs text-emerald-600 font-bold uppercase tracking-widest mb-0.5">SUBJECT:</span>
                                    <h2 className="text-lg md:text-2xl font-bold text-slate-100 uppercase tracking-wider leading-none">
                                        {currentPage.title}
                                    </h2>
                                </div>
                            </div>

                            {/* Manual Text Content */}
                            <div className="flex-1 flex flex-col justify-center p-4 md:p-12 z-10 overflow-hidden relative">
                                <div className="overflow-y-auto max-h-full scrollbar-hide">
                                    <p className="font-mono text-base md:text-2xl text-slate-200 leading-relaxed whitespace-pre-line drop-shadow-md max-w-4xl mx-auto">
                                        {currentPage.content}
                                    </p>
                                </div>
                            </div>

                            {/* Secret Fact Footer */}
                            <div className="shrink-0 bg-slate-900 border-t border-slate-700 z-10 min-h-[60px] flex">
                                <div className="w-12 md:w-16 bg-slate-800 flex items-center justify-center border-r border-slate-700">
                                    <ScanLine className="text-amber-500 w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                                </div>
                                <div className="flex-1 p-2 md:p-3 flex flex-col justify-center">
                                    <span className="text-[9px] md:text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-0.5 flex items-center gap-2">
                                        SALAINEN TIETOISKU <span className="w-full h-px bg-amber-900/50 block"></span>
                                    </span>
                                    <p className="text-xs md:text-sm text-slate-400 italic leading-snug truncate md:whitespace-normal">
                                        {randomFact}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* RIGHT COLUMN: IDENTITY CARD (Profile) - Moves Left on Exit */}
            <motion.div 
                className="lg:col-span-1 hidden lg:block h-full min-h-0 z-10"
                layoutId="identity-card-wrapper"
                transition={{ duration: 0.6, ease: "easeInOut" }}
            >
                <IdentityCard 
                    currentUser={currentUser}
                    callsign={callsign}
                    passedGamesCount={passedGamesCount}
                />
            </motion.div>

        </div>
      </div>

      {/* 3. FOOTER CONTROL */}
      <motion.div 
        className="shrink-0 p-3 md:p-4 bg-slate-950 border-t border-slate-800 w-full z-20 flex gap-2 md:gap-4 items-center justify-between relative"
        exit={{ opacity: 0, y: 50 }}
      >
        <button
            onClick={handlePrev}
            disabled={pageIndex === 0}
            className={`
                h-12 md:h-14 w-12 md:w-auto px-0 md:px-6 flex items-center justify-center gap-2
                font-mono font-bold uppercase tracking-widest text-sm md:text-base transition-all duration-200
                border rounded-sm
                ${pageIndex === 0 
                    ? 'opacity-0 pointer-events-none' 
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200 hover:bg-slate-800'
                }
            `}
        >
            <ArrowLeft size={18} />
            <span className="hidden md:inline">EDELLINEN</span>
        </button>

        {hasCompletedBefore && !isLastPage && (
             <button
                onClick={onComplete}
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

        <button
            onClick={handleNext}
            className={`
                h-12 md:h-14 px-4 md:px-8 flex items-center justify-center gap-2
                font-mono font-bold uppercase tracking-widest text-sm md:text-base transition-all duration-200
                border rounded-sm shadow-lg relative overflow-hidden group
                ${isLastPage 
                    ? 'bg-emerald-600/90 border-emerald-400 text-white hover:bg-emerald-500' 
                    : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-400'
                }
            `}
        >
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1s_infinite]"></div>
            
            <span>{isLastPage ? 'ALOITA KOE' : 'SEURAAVA'}</span>
            <ArrowRight size={20} className={isLastPage ? "animate-pulse" : ""} />
        </button>
      </motion.div>

    </div>
  );
};

export default ManualScreen;
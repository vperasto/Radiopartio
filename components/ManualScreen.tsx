import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Mic, ShieldAlert, Siren, ArrowRight, BookOpen, Sparkles, CheckCircle2, Wifi } from 'lucide-react';
import { MANUAL_PAGES, RADIO_FACTS } from '../constants';
import { Callsign } from '../types';

interface ManualScreenProps {
  callsign: Callsign;
  onComplete: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Radio,
  Mic,
  ShieldAlert,
  Siren,
  CheckCircle2,
  Wifi
};

const ManualScreen: React.FC<ManualScreenProps> = ({ callsign, onComplete }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [randomFact, setRandomFact] = useState<string>('');

  useEffect(() => {
    // Select a random fact for this session
    const fact = RADIO_FACTS[Math.floor(Math.random() * RADIO_FACTS.length)];
    setRandomFact(fact);
  }, []);

  const currentPage = MANUAL_PAGES[pageIndex];
  const isLastPage = pageIndex === MANUAL_PAGES.length - 1;
  const IconComponent = iconMap[currentPage.icon] || Radio;

  const handleNext = () => {
    if (isLastPage) {
      onComplete();
    } else {
      setPageIndex(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-lg md:max-w-3xl mx-auto bg-slate-900 relative overflow-hidden text-slate-200 md:border-x border-slate-800 shadow-2xl transition-all duration-300">
      
      {/* HUD Header */}
      <div className="w-full p-4 border-b border-slate-700 bg-slate-900 z-10 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 font-mono uppercase">ALOKAS</span>
          <span className="text-emerald-500 font-mono font-bold tracking-wider">{callsign}</span>
        </div>
        <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-slate-500" />
            <span className="text-xs text-slate-500 font-mono uppercase">
                SIVU {pageIndex + 1} / {MANUAL_PAGES.length}
            </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-start md:justify-center p-6 pb-32 md:pb-24 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center space-y-6 md:space-y-8 mt-4 md:mt-0"
          >
            {/* Icon Circle */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-slate-600 flex items-center justify-center bg-slate-800/50 relative">
               <IconComponent size={40} className="text-emerald-500" />
               <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-mono font-bold text-slate-100 uppercase border-b-2 border-emerald-500/50 pb-2">
              {currentPage.title}
            </h2>

            {/* Text Content */}
            <div className="bg-slate-800/30 border border-slate-700 p-6 md:p-8 rounded-sm w-full text-left max-w-2xl">
              <p className="font-mono text-base md:text-lg leading-relaxed whitespace-pre-line text-slate-300">
                {currentPage.content}
              </p>
            </div>
            
            {/* Random Fact Box (Only visible on last page or statically at bottom) */}
            {/* We show it on all pages to keep it interesting, or just the first? Let's show it statically at the bottom of the content area */}
            <div className="w-full max-w-2xl mt-4 border border-dashed border-slate-600 bg-slate-900/50 p-4 rounded-sm flex gap-3 items-start">
                <Sparkles size={18} className="text-amber-400 shrink-0 mt-1" />
                <div className="text-left">
                    <span className="text-xs text-amber-400 font-bold uppercase block mb-1">SALAINEN TIETOISKU:</span>
                    <p className="text-xs md:text-sm text-slate-400 font-mono italic leading-relaxed">
                        "{randomFact}"
                    </p>
                </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer / Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900 border-t border-slate-700 max-w-lg md:max-w-3xl mx-auto z-20">
        <button
            onClick={handleNext}
            className={`
                w-full py-4 px-6 flex items-center justify-center gap-2
                font-mono font-bold uppercase tracking-widest transition-all duration-200
                border-2 rounded-sm
                ${isLastPage 
                    ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500' 
                    : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-500'
                }
            `}
        >
            {isLastPage ? 'ALOITA KOE' : 'SEURAAVA SIVU'}
            <ArrowRight size={20} />
        </button>
      </div>

    </div>
  );
};

export default ManualScreen;
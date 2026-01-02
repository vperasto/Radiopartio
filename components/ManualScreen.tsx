import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Mic, ShieldAlert, Siren, ArrowRight, BookOpen } from 'lucide-react';
import { MANUAL_PAGES } from '../constants';
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
};

const ManualScreen: React.FC<ManualScreenProps> = ({ callsign, onComplete }) => {
  const [pageIndex, setPageIndex] = useState(0);

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
      <div className="flex-1 flex flex-col justify-center p-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center space-y-8"
          >
            {/* Icon Circle */}
            <div className="w-24 h-24 rounded-full border-2 border-slate-600 flex items-center justify-center bg-slate-800/50 relative">
               <IconComponent size={48} className="text-emerald-500" />
               <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-mono font-bold text-slate-100 uppercase border-b-2 border-emerald-500/50 pb-2">
              {currentPage.title}
            </h2>

            {/* Text Content */}
            <div className="bg-slate-800/30 border border-slate-700 p-8 rounded-sm w-full text-left max-w-2xl">
              <p className="font-mono text-base md:text-lg leading-relaxed whitespace-pre-line text-slate-300">
                {currentPage.content}
              </p>
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
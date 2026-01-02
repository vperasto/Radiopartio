
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Mic, ShieldAlert, Siren, CheckCircle2, Wifi, ScanLine, Map, Lock, RefreshCw, AlertTriangle, Play, Battery } from 'lucide-react';
import { MANUAL_PAGES, RADIO_FACTS } from '../constants';
import { ManualPage } from '../types';

interface ManualContentProps {
  onStatusUpdate: (status: { title: string; subtitle: string; progress: string; isComplete: boolean; canGoBack: boolean }) => void;
  triggerNext: boolean;
  triggerPrev: boolean;
  onConsumedTrigger: () => void;
  onComplete: () => void;
  targetRankId: string; // CHANGED: Explicit rank ID
}

const iconMap: Record<string, React.ElementType> = {
  Radio,
  Mic,
  ShieldAlert,
  Siren,
  CheckCircle2,
  Wifi,
  ScanLine,
  Map,
  Lock,
  RefreshCw,
  AlertTriangle,
  Play,
  Battery
};

const ManualContent: React.FC<ManualContentProps> = ({ 
  onStatusUpdate, 
  triggerNext, 
  triggerPrev, 
  onConsumedTrigger,
  onComplete,
  targetRankId
}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [randomFact, setRandomFact] = useState<string>('');
  const [pages, setPages] = useState<ManualPage[]>([]);

  useEffect(() => {
    setRandomFact(RADIO_FACTS[Math.floor(Math.random() * RADIO_FACTS.length)]);
    
    // Filter pages based on the specific Target Rank ID provided by parent
    let relevantPages = MANUAL_PAGES.filter(p => p.requiredRankId === targetRankId);
    
    // Fallback if no pages found (shouldn't happen with correct config)
    if (relevantPages.length === 0) {
        relevantPages = MANUAL_PAGES; 
    }

    setPages(relevantPages);
    setPageIndex(0); // Reset to start of new manual
  }, [targetRankId]);

  // Safeguard if pages are loading or empty
  const currentPage = pages[pageIndex] || MANUAL_PAGES[0]; 
  const isLastPage = pageIndex === pages.length - 1;
  const ContentIcon = iconMap[currentPage.icon] || Radio;

  // Report status to parent whenever page changes
  useEffect(() => {
    onStatusUpdate({
      title: "KOULUTUSMANUAALI",
      subtitle: currentPage?.title || "LADATAAN...",
      progress: `${pageIndex + 1} / ${pages.length}`,
      isComplete: isLastPage,
      canGoBack: pageIndex > 0
    });
  }, [pageIndex, isLastPage, onStatusUpdate, currentPage, pages.length]);

  // Handle external triggers from the parent Footer
  useEffect(() => {
    if (triggerNext) {
      if (isLastPage) {
        onComplete();
      } else {
        setPageIndex(prev => prev + 1);
      }
      onConsumedTrigger();
    }
    if (triggerPrev) {
      if (pageIndex > 0) {
        setPageIndex(prev => prev - 1);
      }
      onConsumedTrigger();
    }
  }, [triggerNext, triggerPrev, isLastPage, pageIndex, onConsumedTrigger, onComplete]);

  if (pages.length === 0) return null;

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 relative">
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
                            <span className="text-[10px] md:text-xs text-emerald-600 font-bold uppercase tracking-widest mb-0.5">AIHE:</span>
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
    </div>
  );
};

export default ManualContent;

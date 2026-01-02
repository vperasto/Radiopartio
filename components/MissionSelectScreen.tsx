
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle2, ChevronRight, LayoutGrid, Star } from 'lucide-react';
import { Rank } from '../types';
import { RANKS } from '../constants';

interface MissionSelectScreenProps {
  passedGamesCount: number;
  onSelectRank: (rank: Rank) => void;
  onBack: () => void;
}

const MissionSelectScreen: React.FC<MissionSelectScreenProps> = ({ passedGamesCount, onSelectRank, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center font-mono text-slate-200 selection:bg-emerald-500 selection:text-slate-900">
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-emerald-500/50 bg-emerald-900/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Star size={12} className="fill-emerald-400" />
            Operaattori-tila aktiivinen
        </div>
        <h1 className="text-3xl font-bold uppercase tracking-wider text-white mb-2">Tehtävävalikko</h1>
        <p className="text-slate-500 text-sm">Valitse koulutustaso kertausta varten.</p>
      </motion.div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {RANKS.map((rank, index) => {
          // Since the user has completed everything to see this screen, all are unlocked.
          // But technically logic is:
          const isUnlocked = true; 

          return (
            <motion.button
              key={rank.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectRank(rank)}
              className={`
                group relative p-6 border-2 text-left transition-all duration-300 rounded-sm overflow-hidden
                ${isUnlocked 
                    ? 'bg-slate-900 border-slate-700 hover:border-emerald-500 hover:bg-slate-800' 
                    : 'bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed'}
              `}
            >
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,rgba(16,185,129,0.1)_25%,transparent_25%,transparent_50%,rgba(16,185,129,0.1)_50%,rgba(16,185,129,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px]"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`
                            w-12 h-12 flex items-center justify-center rounded-sm border 
                            ${isUnlocked ? 'bg-slate-800 border-emerald-500/30 text-emerald-500' : 'bg-slate-900 border-slate-700 text-slate-600'}
                        `}>
                            {/* Simple mapping since we don't import icons dynamically easily here without props. Using Rank ID to guess or generic */}
                             <span className="text-xl font-bold">{index + 1}</span>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">TASO {index}</span>
                            <h3 className={`text-xl font-bold uppercase ${isUnlocked ? 'text-white group-hover:text-emerald-400' : 'text-slate-600'}`}>
                                {rank.title}
                            </h3>
                        </div>
                    </div>
                    
                    {isUnlocked ? (
                        <div className="flex items-center gap-2">
                             <div className="flex gap-0.5">
                                 {[...Array(index + 1)].map((_, i) => <div key={i} className="w-1 h-3 bg-emerald-500 rounded-sm" />)}
                             </div>
                             <ChevronRight className="text-slate-600 group-hover:text-emerald-500 transition-transform group-hover:translate-x-1" />
                        </div>
                    ) : (
                        <Lock size={20} className="text-slate-700" />
                    )}
                </div>
            </motion.button>
          );
        })}
      </div>

      <button 
        onClick={onBack}
        className="mt-12 text-slate-500 hover:text-white uppercase text-xs font-bold tracking-widest transition-colors flex items-center gap-2"
      >
          <LayoutGrid size={14} /> Palaa Alkuun
      </button>

    </div>
  );
};

export default MissionSelectScreen;

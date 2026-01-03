
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Star, BatteryMedium, Trophy } from 'lucide-react';
import { Rank, Callsign } from '../types';
import { RANKS } from '../constants';
import IdentityCard from './IdentityCard';

interface MissionSelectScreenProps {
  currentUser: string;
  callsign: Callsign;
  passedGamesCount: number;
  onSelectRank: (rank: Rank) => void;
  onLogout: () => void;
  onChangeCallsign: () => void;
}

const MissionSelectScreen: React.FC<MissionSelectScreenProps> = ({ 
    currentUser,
    callsign,
    passedGamesCount, 
    onSelectRank, 
    onLogout,
    onChangeCallsign
}) => {
  return (
    <div className="fixed inset-0 flex flex-col bg-slate-950 text-slate-200 overflow-hidden font-mono selection:bg-emerald-500 selection:text-slate-900">
      
       {/* 1. TACTICAL HUD HEADER */}
       <div className="shrink-0 h-14 w-full px-4 border-b border-slate-700 bg-slate-900 z-20 flex justify-between items-center shadow-md relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:4px_4px] pointer-events-none"></div>

        <div className="flex items-center gap-4 z-10">
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase leading-none mb-0.5">TILA</span>
                <span className="text-emerald-500 font-bold tracking-widest leading-none text-sm">OPERAATTORI</span>
            </div>
            <div className="hidden md:flex h-6 w-px bg-slate-700"></div>
            <div className="hidden md:flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase leading-none mb-0.5">TEHTÄVÄVALIKKO</span>
                <span className="text-emerald-500/80 text-[10px] leading-none">VALITSE TASO</span>
            </div>
        </div>

        <div className="flex items-center gap-3 z-10">
            <div className="px-2 py-1 bg-emerald-900/20 border border-emerald-900 rounded-sm flex items-center gap-1">
                 <Star size={12} className="fill-emerald-500 text-emerald-500" />
                 <span className="text-[10px] text-emerald-400 font-bold">KAIKKI AVATTU</span>
            </div>
            <BatteryMedium size={20} className="text-emerald-500 hidden md:block" />
        </div>
      </div>

      {/* 2. MAIN GRID LAYOUT */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-2 md:p-6 relative min-h-0 overflow-hidden">
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 relative">
            
            {/* COLUMN 1: IDENTITY CARD */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden lg:block h-full min-h-0 z-10 lg:col-start-1"
            >
                <IdentityCard 
                    currentUser={currentUser}
                    callsign={callsign}
                    passedGamesCount={passedGamesCount}
                    onLogout={onLogout}
                    onChangeCallsign={onChangeCallsign}
                    isReadOnly={false}
                />
            </motion.div>

            {/* COLUMN 2: MISSION GRID */}
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="col-span-1 lg:col-span-2 h-full min-h-0 relative overflow-y-auto scrollbar-hide"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20 md:pb-0">
                    {RANKS.map((rank, index) => (
                        <motion.button
                            key={rank.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onSelectRank(rank)}
                            className="group relative p-6 border-2 border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:border-emerald-500 transition-all duration-300 rounded-sm text-left overflow-hidden flex flex-col h-40 md:h-48 justify-between"
                        >
                             {/* Decorative BG */}
                             <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-[linear-gradient(45deg,rgba(16,185,129,0.5)_25%,transparent_25%,transparent_50%,rgba(16,185,129,0.5)_50%,rgba(16,185,129,0.5)_75%,transparent_75%,transparent)] bg-[length:20px_20px] transition-opacity"></div>
                             
                             <div className="flex justify-between items-start z-10">
                                 <div>
                                     <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-1">TEHTÄVÄ {index}</span>
                                     <h3 className="text-xl md:text-2xl font-bold uppercase text-slate-100 group-hover:text-emerald-400 transition-colors">
                                        {rank.title}
                                     </h3>
                                 </div>
                                 <div className="w-10 h-10 border border-slate-600 bg-slate-800 flex items-center justify-center rounded-sm text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-500/50">
                                     <span className="font-bold text-lg">{index + 1}</span>
                                 </div>
                             </div>

                             <div className="flex items-center gap-2 z-10 mt-4">
                                  <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-500 w-full shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                                  </div>
                                  <ChevronRight className="text-slate-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" size={20} />
                             </div>
                        </motion.button>
                    ))}

                    <div className="md:col-span-2 p-6 border border-dashed border-slate-700 bg-slate-900/30 rounded-sm flex items-center justify-center text-slate-500">
                        <div className="flex items-center gap-2">
                            <Trophy size={16} />
                            <span className="text-xs uppercase tracking-widest">Kaikki tasot suoritettu</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>
      
      {/* Mobile-only Footer */}
      <div className="lg:hidden shrink-0 p-3 bg-slate-950 border-t border-slate-800 flex justify-between gap-4">
         <button 
            onClick={onChangeCallsign} 
            className="flex-1 text-xs font-bold text-emerald-500 border border-slate-700 hover:bg-slate-900 uppercase tracking-widest p-3 rounded-sm"
         >
             Vaihda Tunnus
         </button>
         <button 
            onClick={onLogout} 
            className="flex-1 text-xs font-bold text-rose-500 border border-slate-700 hover:bg-rose-950/30 uppercase tracking-widest p-3 rounded-sm"
         >
             Kirjaudu ulos
         </button>
      </div>

    </div>
  );
};

export default MissionSelectScreen;

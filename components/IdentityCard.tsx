
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Edit2, LogOut, RefreshCw } from 'lucide-react';
import { Callsign } from '../types';
import { RANKS, AVATAR_OPTIONS } from '../constants';
import { StorageUtils } from '../utils/storage';

interface IdentityCardProps {
  currentUser: string;
  callsign: Callsign;
  passedGamesCount: number;
  className?: string;
  isReadOnly?: boolean; 
  onLogout?: () => void;
  onChangeCallsign?: () => void;
}

const IdentityCard: React.FC<IdentityCardProps> = ({ 
    currentUser, 
    callsign, 
    passedGamesCount, 
    className = "", 
    isReadOnly = false,
    onLogout,
    onChangeCallsign
}) => {
  const [avatarId, setAvatarId] = useState('default');
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);

  useEffect(() => {
    setAvatarId(StorageUtils.getUserAvatar(currentUser));
  }, [currentUser]);

  const saveAvatar = (id: string) => {
      setAvatarId(id);
      StorageUtils.saveUserAvatar(currentUser, id);
      setIsAvatarMenuOpen(false);
  };

  // Rank Logic
  const currentRank = [...RANKS].reverse().find(r => passedGamesCount >= r.minPassed) || RANKS[0];
  const nextRank = RANKS[RANKS.indexOf(currentRank) + 1];
  const progressToNext = nextRank 
      ? Math.min(100, Math.max(0, ((passedGamesCount - currentRank.minPassed) / (nextRank.minPassed - currentRank.minPassed)) * 100))
      : 100;

  const AvatarIcon = AVATAR_OPTIONS.find(a => a.id === avatarId)?.icon || User;

  return (
    <div className={`flex flex-col h-full min-h-0 border-2 border-slate-700 bg-slate-900/80 rounded-sm relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
        
        {/* ID Header */}
        <div className="p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">IDENTITY CARD</span>
            <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
        </div>

        {/* Avatar Section */}
        <div className="p-6 flex flex-col items-center border-b border-slate-800 relative">
            <div 
                className={`relative group ${!isReadOnly ? 'cursor-pointer' : ''}`} 
                onClick={() => !isReadOnly && setIsAvatarMenuOpen(true)}
            >
                <div className="w-24 h-24 md:w-32 md:h-32 border-2 border-slate-600 bg-slate-800 rounded-sm flex items-center justify-center overflow-hidden shadow-lg group-hover:border-emerald-500 transition-colors">
                    <AvatarIcon size={64} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
                </div>
                {!isReadOnly && (
                    <div className="absolute bottom-2 right-2 bg-slate-900 p-1.5 rounded-sm border border-slate-600 group-hover:border-emerald-500">
                            <Edit2 size={12} className="text-emerald-500" />
                    </div>
                )}
            </div>
            
            <h2 className="mt-4 text-xl font-bold text-white uppercase tracking-wider">{currentUser}</h2>
            
            <div className="flex flex-col items-center mt-2 group">
                <span className="text-sm text-emerald-500 font-bold font-mono tracking-wider">"{callsign}"</span>
                
                {!isReadOnly && onChangeCallsign && (
                    <button 
                        onClick={onChangeCallsign}
                        className="mt-1 flex items-center gap-1.5 px-2 py-1 bg-slate-800 border border-slate-700 hover:border-emerald-500 rounded-sm group/btn transition-all"
                        title="Vaihda radiotunnus"
                    >
                        <RefreshCw size={10} className="text-slate-400 group-hover/btn:text-emerald-500" />
                        <span className="text-[10px] font-mono text-slate-500 group-hover/btn:text-emerald-500 font-bold uppercase">VAIHDA</span>
                    </button>
                )}
            </div>

            {/* Avatar Selection Modal */}
            <AnimatePresence>
                {isAvatarMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 bg-slate-900/95 z-50 p-4 grid grid-cols-4 gap-2 overflow-y-auto content-start"
                    >
                        <div className="col-span-4 flex justify-between items-center mb-2 pb-2 border-b border-slate-700">
                            <span className="text-xs text-emerald-500 font-bold">VALITSE KUVA</span>
                            <button onClick={(e) => { e.stopPropagation(); setIsAvatarMenuOpen(false); }} className="text-slate-400 hover:text-white">X</button>
                        </div>
                        {AVATAR_OPTIONS.map(opt => (
                            <button
                                key={opt.id}
                                onClick={(e) => { e.stopPropagation(); saveAvatar(opt.id); }}
                                className={`aspect-square flex items-center justify-center border bg-slate-800 rounded-sm hover:bg-slate-700 ${avatarId === opt.id ? 'border-emerald-500 text-emerald-500' : 'border-slate-700 text-slate-400'}`}
                            >
                                <opt.icon size={20} />
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Rank Section */}
        <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-900/30 rounded-sm border border-emerald-900">
                        <User size={24} className="text-emerald-500" />
                </div>
                <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">NYKYINEN TASO</span>
                    <span className="text-lg text-emerald-400 font-bold uppercase leading-none">{currentRank.title}</span>
                </div>
            </div>

            {/* XP / Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-[10px] font-mono mb-1 text-slate-400">
                    <span>EDISTYMINEN</span>
                    <span>{nextRank ? `${passedGamesCount} / ${nextRank.minPassed} KOETTA` : 'MAX LEVEL'}</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressToNext}%` }}
                        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    ></motion.div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mt-auto">
                <div className="bg-slate-800/50 p-2 border border-slate-700 rounded-sm">
                    <span className="block text-[9px] text-slate-500 uppercase">SUORITETUT</span>
                    <span className="block text-xl font-bold text-slate-200">{passedGamesCount}</span>
                </div>
                <div className="bg-slate-800/50 p-2 border border-slate-700 rounded-sm">
                    <span className="block text-[9px] text-slate-500 uppercase">AKTIIVISUUS</span>
                    <span className="block text-xl font-bold text-slate-200">100%</span>
                </div>
            </div>
        </div>

        {/* Footer / Logout */}
        {onLogout ? (
             <div className="p-3 bg-slate-950 border-t border-slate-800">
                <button 
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 py-2 border border-slate-700 hover:border-rose-500 hover:bg-rose-900/10 text-slate-400 hover:text-rose-400 transition-colors rounded-sm text-xs font-bold uppercase tracking-wider"
                >
                    <LogOut size={14} />
                    Kirjaudu ulos
                </button>
             </div>
        ) : (
            <div className="p-2 bg-slate-950 text-center border-t border-slate-800">
                <span className="text-[9px] text-slate-600 font-mono tracking-[0.2em]">CLASSIFIED // EYES ONLY</span>
            </div>
        )}
    </div>
  );
};

export default IdentityCard;

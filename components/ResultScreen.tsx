import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, RefreshCw, LogOut } from 'lucide-react';
import { Callsign } from '../types';

interface ResultScreenProps {
  score: number;
  total: number;
  callsign: Callsign;
  onRestart: () => void;
  onLogout: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, total, callsign, onRestart, onLogout }) => {
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 70;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 w-full">
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
        className="w-full max-w-sm md:max-w-lg bg-slate-800 border-2 border-slate-600 p-1 relative shadow-2xl"
      >
        {/* Decorative Screws */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-slate-600"></div>
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-600"></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-slate-600"></div>
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-slate-600"></div>

        {/* Inner Card Content */}
        <div className="border border-slate-700 bg-slate-900 p-6 md:p-10 flex flex-col items-center text-center">
            
            <div className="mb-6 mt-4">
                {passed ? (
                    <Shield size={64} className="text-emerald-500" strokeWidth={1.5} />
                ) : (
                    <Shield size={64} className="text-amber-600" strokeWidth={1.5} />
                )}
            </div>

            <h2 className="text-2xl md:text-3xl font-mono font-bold text-slate-100 mb-1 uppercase tracking-wider">
                {passed ? 'RADIOLUPA' : 'KOULUTUS KESKEN'}
            </h2>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-6">
                Virallinen Sertifikaatti
            </p>

            <div className="w-full border-t border-b border-slate-700 py-4 mb-6 space-y-2">
                <div className="flex justify-between items-center text-sm md:text-base font-mono">
                    <span className="text-slate-500">KOODINIMI:</span>
                    <span className="text-emerald-400 font-bold">{callsign}</span>
                </div>
                <div className="flex justify-between items-center text-sm md:text-base font-mono">
                    <span className="text-slate-500">PISTEET:</span>
                    <span className={`${passed ? 'text-slate-200' : 'text-rose-400'}`}>
                        {score} / {total}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm md:text-base font-mono">
                    <span className="text-slate-500">STATUS:</span>
                    <span className={`${passed ? 'text-emerald-500' : 'text-amber-500'} uppercase font-bold`}>
                        {passed ? 'HYVÄKSYTTY' : 'HYLÄTTY'}
                    </span>
                </div>
            </div>

            {/* Stars for fun */}
            <div className="flex gap-2 mb-8">
                {[...Array(3)].map((_, i) => (
                    <Star 
                        key={i} 
                        size={24} 
                        className={i < Math.floor((score / total) * 3) ? "text-emerald-500 fill-emerald-500/20" : "text-slate-700"} 
                    />
                ))}
            </div>

            <p className="text-xs md:text-sm text-slate-400 font-mono italic mb-6">
                {passed 
                    ? "Onneksi olkoon, operaattori. Olet valmis kentälle." 
                    : "Kertaus on opintojen äiti. Yritä uudelleen."}
            </p>

            <div className="w-full flex flex-col gap-3">
              <button
                  onClick={onRestart}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 border border-slate-600 hover:border-emerald-500 text-slate-200 font-mono text-sm uppercase tracking-wider transition-colors rounded-sm"
              >
                  <RefreshCw size={16} />
                  {passed ? 'Uusi Koulutus' : 'Yritä Uudelleen'}
              </button>

              <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-transparent border border-transparent hover:bg-slate-800 text-slate-500 hover:text-slate-300 font-mono text-sm uppercase tracking-wider transition-colors rounded-sm"
              >
                  <LogOut size={16} />
                  Kirjaudu ulos
              </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultScreen;
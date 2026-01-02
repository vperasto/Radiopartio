import React from 'react';
import { motion } from 'framer-motion';
import { Radio, ChevronRight } from 'lucide-react';
import { CALLSIGNS } from '../constants';
import { Callsign } from '../types';

interface StartScreenProps {
  onSelectCallsign: (callsign: Callsign) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onSelectCallsign }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-md md:max-w-4xl mx-auto transition-all duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center mb-4 text-emerald-500">
          <Radio size={64} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase text-slate-100">
          Radiopartio
        </h1>
        <div className="h-px w-full bg-slate-700 mb-2"></div>
        <p className="text-sm text-slate-400 font-mono tracking-widest uppercase">
          Koulutusmoduuli v1.0
        </p>
      </motion.div>

      <div className="w-full">
        <p className="text-xs text-emerald-500 uppercase font-mono mb-4 pl-1 border-l-2 border-emerald-500">
          Valitse koodinimi
        </p>
        
        {/* Responsive Grid for Callsigns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CALLSIGNS.map((sign, index) => (
            <motion.button
              key={sign}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectCallsign(sign)}
              className="w-full group relative flex items-center justify-between p-4 border border-slate-600 bg-slate-800/50 hover:bg-emerald-900/20 hover:border-emerald-500 transition-colors duration-200 rounded-sm"
            >
              <span className="font-mono text-lg font-bold text-slate-200 group-hover:text-emerald-400">
                {sign}
              </span>
              <ChevronRight className="text-slate-600 group-hover:text-emerald-500 transition-colors" />
              
              {/* Tactical corner markers */}
              <div className="absolute top-0 left-0 w-1 h-1 bg-slate-500 group-hover:bg-emerald-400 transition-colors"></div>
              <div className="absolute bottom-0 right-0 w-1 h-1 bg-slate-500 group-hover:bg-emerald-400 transition-colors"></div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center text-xs text-slate-600 font-mono">
        SYSTEM READY // WAITING FOR INPUT
      </div>
    </div>
  );
};

export default StartScreen;
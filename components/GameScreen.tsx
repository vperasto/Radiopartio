import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, RefreshCcw, BookOpen, Battery } from 'lucide-react';
import { QuestionVariant, QuestionType, Option, Callsign } from '../types';
import { StorageUtils } from '../utils/storage';
import PTTButton from './PTTButton';
import IdentityCard from './IdentityCard';

interface GameScreenProps {
  callsign: Callsign;
  currentUser: string;
  passedGamesCount: number;
  onGameComplete: (score: number) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ callsign, currentUser, passedGamesCount, onGameComplete }) => {
  const [questions, setQuestions] = useState<QuestionVariant[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; msg: string } | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isQuestionSolved, setIsQuestionSolved] = useState(false);
  const [hasMadeMistake, setHasMadeMistake] = useState(false);

  useEffect(() => {
    const categories = StorageUtils.getQuestionBank();
    const sessionQuestions = categories.map(cat => {
      const randomIndex = Math.floor(Math.random() * cat.variants.length);
      return { 
          ...cat.variants[randomIndex], 
          categoryTitle: cat.title 
      }; 
    });
    setQuestions(sessionQuestions);
  }, []);

  if (questions.length === 0) return <div className="fixed inset-0 flex items-center justify-center text-slate-500 font-mono">LADATAAN TEHTÄVIÄ...</div>;

  const currentQuestion = questions[currentIndex];
  const formatText = (text: string) => text.replace(/{CALLSIGN}/g, callsign);

  const handleAnswer = (option: Option) => {
    if (isLocked) return;
    setIsLocked(true);

    if (option.isCorrect) {
      setFeedback({ type: 'correct', msg: option.feedback });
      setIsQuestionSolved(true);
      if (!hasMadeMistake) {
        setScore(prev => prev + 1);
      }
    } else {
      setFeedback({ type: 'wrong', msg: option.feedback });
      setHasMadeMistake(true);
    }
  };

  const handleDismissFeedback = () => {
    setFeedback(null);
    setIsLocked(false);

    if (isQuestionSolved) {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsQuestionSolved(false);
            setHasMadeMistake(false);
        } else {
            onGameComplete(score + (hasMadeMistake ? 0 : 1));
        }
    }
  };

  const handlePTTSuccess = () => {
    if (isLocked) return;
    const correctOption = currentQuestion.options.find(o => o.isCorrect);
    if (correctOption) handleAnswer(correctOption);
  };

  const handlePTTFail = (reason: string) => {
      if (isLocked) return;
      setIsLocked(true);
      setHasMadeMistake(true);
      setFeedback({ type: 'wrong', msg: reason });
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-950 text-slate-200 overflow-hidden font-mono selection:bg-emerald-500 selection:text-slate-900">
      
       {/* 1. TACTICAL HUD HEADER */}
       <div className="shrink-0 h-14 w-full px-4 border-b border-slate-700 bg-slate-900 z-20 flex justify-between items-center shadow-md relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:4px_4px] pointer-events-none"></div>

        <div className="flex items-center gap-4 z-10">
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase leading-none mb-0.5">TEHTÄVÄ</span>
                <span className="text-emerald-500 font-bold tracking-widest leading-none text-sm animate-pulse">KÄYNNISSÄ...</span>
            </div>
            <div className="hidden md:flex h-6 w-px bg-slate-700"></div>
        </div>

        <div className="flex items-center gap-3 z-10">
             <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded-sm border border-slate-700">
                <BookOpen size={12} className="text-slate-400" />
                <span className="text-xs text-slate-300 font-bold">
                    {currentIndex + 1}<span className="text-slate-500">/</span>{questions.length}
                </span>
            </div>
            <Battery size={16} className="text-emerald-500 hidden md:block" />
        </div>
      </div>

      {/* 2. MAIN DISPLAY AREA */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-2 md:p-6 relative min-h-0 overflow-hidden">
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            
            {/* LEFT COLUMN: IDENTITY CARD (Moves here from Manual Right) */}
            <motion.div 
                className="lg:col-span-1 hidden lg:block h-full min-h-0 z-10"
                layoutId="identity-card-wrapper"
                transition={{ duration: 0.6, ease: "easeInOut" }}
            >
                <IdentityCard 
                    currentUser={currentUser}
                    callsign={callsign}
                    passedGamesCount={passedGamesCount}
                    isReadOnly={true}
                />
            </motion.div>

            {/* RIGHT COLUMN: GAME CONTENT (Slides in from Right) */}
            <motion.div 
                 className="lg:col-span-2 flex flex-col h-full min-h-0 relative"
                 initial={{ x: 300, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
                <div className="flex-1 border-2 border-slate-700 bg-slate-900/50 rounded-sm relative flex flex-col overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                     {/* Decorative Corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-slate-500/50 z-20"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-slate-500/50 z-20"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-slate-500/50 z-20"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-slate-500/50 z-20"></div>

                     {/* Game Content Header */}
                     <div className="shrink-0 p-4 flex items-center gap-4 border-b border-slate-700/50 bg-slate-800/30 z-10 backdrop-blur-sm">
                        <div className="px-3 py-1 rounded-sm bg-slate-800 border border-slate-600">
                             <span className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest">AIHE</span>
                        </div>
                        <h2 className="text-lg md:text-xl font-bold text-slate-100 uppercase tracking-wider leading-none">
                             {(currentQuestion as any).categoryTitle}
                        </h2>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestion.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full max-w-2xl mx-auto"
                            >
                                <h3 className="text-lg md:text-2xl font-mono text-slate-200 mb-8 leading-relaxed border-l-4 border-emerald-500/50 pl-4">
                                    {formatText(currentQuestion.scenario)}
                                </h3>

                                <div className="space-y-3">
                                    {currentQuestion.type === QuestionType.MULTIPLE_CHOICE && (
                                        currentQuestion.options.map((option) => (
                                            <button
                                            key={option.id}
                                            onClick={() => handleAnswer(option)}
                                            disabled={isLocked}
                                            className={`
                                                w-full p-4 md:p-6 text-left font-mono text-sm md:text-lg border transition-all duration-200 relative group rounded-sm
                                                ${isLocked 
                                                    ? 'opacity-50 cursor-not-allowed border-slate-700 text-slate-500' 
                                                    : 'border-slate-600 bg-slate-800/30 text-slate-300 hover:border-emerald-500 hover:bg-slate-800'
                                                }
                                            `}
                                            >
                                            <div className="flex items-start gap-3">
                                                <span className="text-slate-500 group-hover:text-emerald-500 font-bold">{option.id.toUpperCase()}:</span>
                                                <span>{formatText(option.text)}</span>
                                            </div>
                                            </button>
                                        ))
                                    )}

                                    {currentQuestion.type === QuestionType.PTT_TIMING && (
                                        <PTTButton onSuccess={handlePTTSuccess} onFail={handlePTTFail} />
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </motion.div>
        </div>
      </div>

      {/* Feedback Overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`
              fixed bottom-0 left-0 right-0 p-6 z-50 border-t-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]
              ${feedback.type === 'correct' 
                ? 'bg-slate-900 border-emerald-500' 
                : 'bg-slate-900 border-rose-500'
              }
            `}
          >
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-3">
                    {feedback.type === 'correct' ? (
                        <CheckCircle2 className="text-emerald-500" size={32} />
                    ) : (
                        <AlertCircle className="text-rose-500" size={32} />
                    )}
                    <h3 className={`font-mono text-xl font-bold uppercase ${feedback.type === 'correct' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {feedback.type === 'correct' ? 'KUITTI!' : 'VIRHE!'}
                    </h3>
                </div>
                
                <p className="font-mono text-slate-300 mb-6 text-sm md:text-base leading-relaxed">
                    {formatText(feedback.msg)}
                </p>

                <button
                    onClick={handleDismissFeedback}
                    className={`
                        w-full py-4 px-6 font-mono font-bold uppercase tracking-widest text-slate-900 transition-colors flex items-center justify-center gap-2 rounded-sm
                        ${feedback.type === 'correct' ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-rose-500 hover:bg-rose-400'}
                    `}
                >
                    {feedback.type === 'correct' ? (
                        'JATKA >>'
                    ) : (
                        <>
                           <RefreshCcw size={18} /> YRITÄ UUDELLEEN
                        </>
                    )}
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default GameScreen;
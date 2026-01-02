
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';
import { QuestionVariant, QuestionType, Option, Callsign } from '../types';
import { StorageUtils } from '../utils/storage';
import PTTButton from './PTTButton';

interface GameContentProps {
  callsign: Callsign;
  onStatusUpdate: (status: { title: string; subtitle: string; progress: string; isComplete: boolean; canGoBack: boolean }) => void;
  triggerNext: boolean; 
  onConsumedTrigger: () => void;
  onGameComplete: (score: number, totalQuestions: number) => void;
  targetRankId: string; // CHANGED: Explicit rank ID
}

const GameContent: React.FC<GameContentProps> = ({ 
  callsign, 
  onStatusUpdate, 
  triggerNext,
  onConsumedTrigger,
  onGameComplete,
  targetRankId
}) => {
  const [questions, setQuestions] = useState<QuestionVariant[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; msg: string } | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isQuestionSolved, setIsQuestionSolved] = useState(false);
  const [hasMadeMistake, setHasMadeMistake] = useState(false);

  useEffect(() => {
    // 1. Get all questions
    const allCategories = StorageUtils.getQuestionBank();

    // 2. Filter Questions based on specific target Rank ID
    let relevantCategories = allCategories.filter(cat => cat.requiredRankId === targetRankId);

    // Fallback if no questions found for this rank (shouldn't happen)
    if (relevantCategories.length === 0) {
        // Fallback to searching for R0
        relevantCategories = allCategories.filter(cat => cat.requiredRankId === 'R0');
    }

    // 3. Flatten and Shuffle
    const sessionQuestions = relevantCategories.map(cat => {
      const randomIndex = Math.floor(Math.random() * cat.variants.length);
      return { 
          ...cat.variants[randomIndex], 
          categoryTitle: cat.title 
      }; 
    });

    // Simple Shuffle
    sessionQuestions.sort(() => Math.random() - 0.5);

    setQuestions(sessionQuestions);
  }, [targetRankId]);

  useEffect(() => {
    if (triggerNext && feedback) {
        handleDismissFeedback();
        onConsumedTrigger();
    }
  }, [triggerNext, feedback]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
      if (questions.length > 0) {
        onStatusUpdate({
            title: "KOETILANNE",
            subtitle: (currentQuestion as any)?.categoryTitle || "LADATAAN...",
            progress: `${currentIndex + 1} / ${questions.length}`,
            isComplete: false, 
            canGoBack: false 
        });
      }
  }, [currentIndex, questions.length, currentQuestion, onStatusUpdate]);

  if (questions.length === 0) return <div className="text-slate-500 font-mono p-10 flex items-center justify-center h-full">ETSIMÄSSÄ TEHTÄVIÄ...</div>;

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
            // Pass both score and total questions to the parent
            onGameComplete(score + (hasMadeMistake ? 0 : 1), questions.length);
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
    <div className="flex-1 flex flex-col h-full min-h-0 relative">
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
            <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto relative scrollbar-hide">
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

        {/* Feedback Overlay */}
        <AnimatePresence>
            {feedback && (
                <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`
                    absolute bottom-0 left-0 right-0 p-6 z-50 border-t-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]
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

export default GameContent;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';
import { QuestionVariant, QuestionType, Option, Callsign } from '../types';
import { StorageUtils } from '../utils/storage';
import PTTButton from './PTTButton';

interface GameScreenProps {
  callsign: Callsign;
  onGameComplete: (score: number) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ callsign, onGameComplete }) => {
  const [questions, setQuestions] = useState<QuestionVariant[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0); // Only counts first tries
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; msg: string } | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  
  // State to track if the current question has been answered correctly eventually
  const [isQuestionSolved, setIsQuestionSolved] = useState(false);
  // State to track if the user made a mistake on the CURRENT question
  const [hasMadeMistake, setHasMadeMistake] = useState(false);

  useEffect(() => {
    // Generate Game Session
    // 1. Get Categories from Storage
    const categories = StorageUtils.getQuestionBank();
    // 2. Pick one random variant from each category
    const sessionQuestions = categories.map(cat => {
      const randomIndex = Math.floor(Math.random() * cat.variants.length);
      return { 
          ...cat.variants[randomIndex], 
          categoryTitle: cat.title // Inject title for display
      }; 
    });
    setQuestions(sessionQuestions);
  }, []);

  if (questions.length === 0) return <div className="p-8 text-center font-mono">LOADING MISSION DATA...</div>;

  const currentQuestion = questions[currentIndex];
  // Helper to replace {CALLSIGN} in text
  const formatText = (text: string) => text.replace(/{CALLSIGN}/g, callsign);

  const handleAnswer = (option: Option) => {
    if (isLocked) return;
    setIsLocked(true);

    if (option.isCorrect) {
      setFeedback({ type: 'correct', msg: option.feedback });
      setIsQuestionSolved(true);
      // Only award point if no mistakes were made on this question
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
        // Move to next question
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsQuestionSolved(false);
            setHasMadeMistake(false);
        } else {
            // End Game
            onGameComplete(score + (hasMadeMistake ? 0 : 1)); // Add last point logic
        }
    } else {
        // Retry same question (logic handled by state reset above)
        // Just unlocked UI for user to try again
    }
  };

  // Special handler for PTT type questions
  const handlePTTSuccess = () => {
    if (isLocked) return;
    const correctOption = currentQuestion.options.find(o => o.isCorrect);
    if (correctOption) {
        handleAnswer(correctOption);
    }
  };

  const handlePTTFail = (reason: string) => {
      if (isLocked) return;
      setIsLocked(true);
      setHasMadeMistake(true);
      setFeedback({ type: 'wrong', msg: reason });
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-lg md:max-w-3xl mx-auto bg-slate-900 relative overflow-hidden md:border-x border-slate-800 shadow-2xl transition-all duration-300">
      
      {/* Header / HUD */}
      <div className="w-full p-4 border-b border-slate-700 bg-slate-900 z-10 flex justify-between items-center">
        <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-mono uppercase">Operaattori</span>
            <span className="text-emerald-500 font-mono font-bold tracking-wider">{callsign}</span>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 font-mono uppercase">Tehtävä</span>
            <span className="text-slate-200 font-mono">{currentIndex + 1} / {questions.length}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative p-4 pb-24 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            {/* Category Tag */}
            <div className="inline-block px-2 py-1 mb-4 text-xs font-bold text-slate-900 bg-slate-400 rounded-sm font-mono uppercase">
              {(currentQuestion as any).categoryTitle}
            </div>

            {/* Scenario */}
            <h2 className="text-lg md:text-2xl font-mono text-slate-200 mb-8 leading-relaxed border-l-4 border-slate-600 pl-4">
              {formatText(currentQuestion.scenario)}
            </h2>

            {/* Interactions */}
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
                      {/* Decorative corner */}
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-slate-700 group-hover:bg-emerald-500 transition-colors"></div>
                    </button>
                 ))
              )}

              {currentQuestion.type === QuestionType.PTT_TIMING && (
                  <PTTButton 
                    onSuccess={handlePTTSuccess}
                    onFail={handlePTTFail}
                  />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
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
              fixed bottom-0 left-0 right-0 p-6 z-50 border-t-4 shadow-2xl
              ${feedback.type === 'correct' 
                ? 'bg-slate-800 border-emerald-500' 
                : 'bg-slate-800 border-rose-500'
              }
            `}
          >
            <div className="max-w-lg md:max-w-3xl mx-auto">
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
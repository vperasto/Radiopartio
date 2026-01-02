
import React, { useState } from 'react';
import { GameState, Callsign } from './types';
import { StorageUtils } from './utils/storage';
import UserSelectScreen from './components/UserSelectScreen';
import StartScreen from './components/StartScreen';
import ResultScreen from './components/ResultScreen';
import TrainingSession from './components/TrainingSession';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('USER_SELECT');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [callsign, setCallsign] = useState<Callsign | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [totalQuestionsPlayed, setTotalQuestionsPlayed] = useState(0);

  // Get user history for rank calculations
  const userHistory = currentUser ? StorageUtils.getUserHistory(currentUser) : [];
  const passedCount = userHistory.filter(h => h.passed).length;
  const hasCompletedBefore = passedCount > 0;

  const handleUserSelect = (user: string) => {
    setCurrentUser(user);
    setGameState('START');
  };

  const handleAdminLogin = () => {
    setCurrentUser('ADMIN');
    setGameState('ADMIN_DASHBOARD');
  }

  const handleStart = (selectedCallsign: Callsign) => {
    setCallsign(selectedCallsign);
    // Instead of separating Manual/Playing, we use a single session state
    setGameState('MANUAL'); 
  };

  const handleGameComplete = (score: number, totalQuestions: number) => {
    setFinalScore(score);
    setTotalQuestionsPlayed(totalQuestions);
    
    // Save Result
    if (currentUser && callsign) {
        StorageUtils.saveGameResult({
            id: Date.now().toString(),
            timestamp: Date.now(),
            user: currentUser,
            callsign: callsign,
            score: score,
            total: totalQuestions, // Save the actual number of questions played in this specific session
            passed: score / totalQuestions >= 0.7
        });
    }

    setGameState('FINISHED');
  };

  const handleRestart = () => {
    setGameState('START');
    setCallsign(null);
    setFinalScore(0);
    setTotalQuestionsPlayed(0);
  };

  const handleLogout = () => {
    setGameState('USER_SELECT');
    setCurrentUser(null);
    setCallsign(null);
    setFinalScore(0);
    setTotalQuestionsPlayed(0);
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 selection:bg-emerald-500 selection:text-slate-900 relative overflow-hidden">
      
      {gameState === 'USER_SELECT' && (
        <UserSelectScreen 
            onUserSelect={handleUserSelect} 
            onAdminLogin={handleAdminLogin}
        />
      )}

      {gameState === 'ADMIN_DASHBOARD' && (
        <AdminPanel onLogout={handleLogout} />
      )}

      {gameState === 'START' && (
        <StartScreen onSelectCallsign={handleStart} />
      )}

      {/* Unified Training Session Component */}
      {(gameState === 'MANUAL' || gameState === 'PLAYING') && callsign && currentUser && (
        <TrainingSession 
            callsign={callsign}
            currentUser={currentUser}
            passedGamesCount={passedCount}
            hasCompletedBefore={hasCompletedBefore}
            onGameComplete={handleGameComplete}
            onExit={handleRestart}
        />
      )}

      {gameState === 'FINISHED' && callsign && (
        <ResultScreen 
          score={finalScore} 
          total={totalQuestionsPlayed} // Pass the dynamic total
          callsign={callsign} 
          onRestart={handleRestart} 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;

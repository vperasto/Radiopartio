import React, { useState } from 'react';
import { GameState, Callsign } from './types';
import { INITIAL_QUESTION_BANK } from './constants';
import { StorageUtils } from './utils/storage';
import UserSelectScreen from './components/UserSelectScreen';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import ManualScreen from './components/ManualScreen';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('USER_SELECT');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [callsign, setCallsign] = useState<Callsign | null>(null);
  const [finalScore, setFinalScore] = useState(0);

  const handleUserSelect = (user: string) => {
    setCurrentUser(user);
    // Case-insensitive check for admin
    if (user.toLowerCase() === 'crimescene') {
        setGameState('ADMIN_DASHBOARD');
    } else {
        setGameState('START');
    }
  };

  const handleStart = (selectedCallsign: Callsign) => {
    setCallsign(selectedCallsign);
    setGameState('MANUAL');
  };

  const handleManualComplete = () => {
    setGameState('PLAYING');
  };

  const handleGameComplete = (score: number) => {
    setFinalScore(score);
    
    // Save Result
    if (currentUser && callsign) {
        StorageUtils.saveGameResult({
            id: Date.now().toString(),
            timestamp: Date.now(),
            user: currentUser,
            callsign: callsign,
            score: score,
            total: INITIAL_QUESTION_BANK.length, // Rough estimate based on bank categories
            passed: score / INITIAL_QUESTION_BANK.length >= 0.7
        });
    }

    setGameState('FINISHED');
  };

  const handleRestart = () => {
    setGameState('START');
    setCallsign(null);
    setFinalScore(0);
  };

  const handleLogout = () => {
    setGameState('USER_SELECT');
    setCurrentUser(null);
    setCallsign(null);
    setFinalScore(0);
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 selection:bg-emerald-500 selection:text-slate-900 relative">
      
      {gameState === 'USER_SELECT' && (
        <UserSelectScreen onUserSelect={handleUserSelect} />
      )}

      {gameState === 'ADMIN_DASHBOARD' && (
        <AdminPanel onLogout={handleLogout} />
      )}

      {gameState === 'START' && (
        <StartScreen onSelectCallsign={handleStart} />
      )}

      {gameState === 'MANUAL' && callsign && (
        <ManualScreen 
            callsign={callsign}
            onComplete={handleManualComplete}
        />
      )}
      
      {gameState === 'PLAYING' && callsign && (
        <GameScreen 
          callsign={callsign} 
          onGameComplete={handleGameComplete} 
        />
      )}

      {gameState === 'FINISHED' && callsign && (
        <ResultScreen 
          score={finalScore} 
          total={INITIAL_QUESTION_BANK.length} 
          callsign={callsign} 
          onRestart={handleRestart} 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
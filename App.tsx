
import React, { useState, useEffect } from 'react';
import { GameState, Callsign, Rank } from './types';
import { StorageUtils } from './utils/storage';
import UserSelectScreen from './components/UserSelectScreen';
import StartScreen from './components/StartScreen';
import ResultScreen from './components/ResultScreen';
import TrainingSession from './components/TrainingSession';
import AdminPanel from './components/AdminPanel';
import MissionSelectScreen from './components/MissionSelectScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('USER_SELECT');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [callsign, setCallsign] = useState<Callsign | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [totalQuestionsPlayed, setTotalQuestionsPlayed] = useState(0);
  
  // Specific rank override for Mission Select (review mode)
  const [selectedRankId, setSelectedRankId] = useState<string | undefined>(undefined);

  // Initialize: Check for persisted session (User AND Callsign)
  useEffect(() => {
    const lastUser = StorageUtils.getLastUser();
    const lastCallsign = StorageUtils.getLastCallsign();
    
    if (lastUser) {
        setCurrentUser(lastUser);
        if (lastCallsign) {
             setCallsign(lastCallsign as Callsign);
             
             // Check rank to decide start screen
             const history = StorageUtils.getUserHistory(lastUser);
             const passed = history.filter(h => h.passed).length;
             
             if (passed >= 4) {
                 setGameState('MISSION_SELECT');
             } else {
                 setGameState('MANUAL');
             }
        } else {
            setGameState('START'); // User known, but needs to pick callsign
        }
    }
  }, []);

  // Get user history for rank calculations
  const userHistory = currentUser ? StorageUtils.getUserHistory(currentUser) : [];
  const passedCount = userHistory.filter(h => h.passed).length;
  const hasCompletedBefore = passedCount > 0;
  const isMasterOperator = passedCount >= 4; // Completed all 4 levels

  const handleUserSelect = (user: string) => {
    setCurrentUser(user);
    StorageUtils.setLastUser(user);
    setGameState('START');
  };

  const handleAdminLogin = () => {
    setCurrentUser('ADMIN');
    setGameState('ADMIN_DASHBOARD');
  }

  const handleStart = (selectedCallsign: Callsign) => {
    setCallsign(selectedCallsign);
    StorageUtils.setLastCallsign(selectedCallsign); // Persist CallSign

    if (isMasterOperator) {
        setGameState('MISSION_SELECT');
    } else {
        setSelectedRankId(undefined); 
        setGameState('MANUAL'); 
    }
  };

  const handleSelectRank = (rank: Rank) => {
      setSelectedRankId(rank.id);
      setGameState('MANUAL');
  };

  const handleGameComplete = (score: number, totalQuestions: number) => {
    setFinalScore(score);
    setTotalQuestionsPlayed(totalQuestions);
    
    if (currentUser && callsign) {
        StorageUtils.saveGameResult({
            id: Date.now().toString(),
            timestamp: Date.now(),
            user: currentUser,
            callsign: callsign,
            score: score,
            total: totalQuestions,
            passed: score / totalQuestions >= 0.7
        });
    }

    setGameState('FINISHED');
  };

  // Called when finishing a level or clicking "Back" in result
  const handleRestart = () => {
    // If master operator, go to mission select. Otherwise, if mid-progression, start manual.
    // However, usually we want to see the menu if available.
    if (isMasterOperator) {
        setGameState('MISSION_SELECT');
    } else {
        // Linear progression continue
        setGameState('MANUAL'); 
    }
    setFinalScore(0);
    setTotalQuestionsPlayed(0);
    setSelectedRankId(undefined);
  };

  // Change only the Callsign (Keep User)
  const handleChangeCallsign = () => {
      setGameState('START');
      StorageUtils.clearCallsign();
      setCallsign(null);
      setFinalScore(0);
      setTotalQuestionsPlayed(0);
      setSelectedRankId(undefined);
  }

  // Full Logout (Clear User & Callsign)
  const handleLogout = () => {
    setGameState('USER_SELECT');
    StorageUtils.clearSession();
    setCurrentUser(null);
    setCallsign(null);
    setFinalScore(0);
    setTotalQuestionsPlayed(0);
    setSelectedRankId(undefined);
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

      {gameState === 'MISSION_SELECT' && currentUser && callsign && (
          <MissionSelectScreen 
              currentUser={currentUser}
              callsign={callsign}
              passedGamesCount={passedCount}
              onSelectRank={handleSelectRank}
              onLogout={handleLogout}
              onChangeCallsign={handleChangeCallsign}
          />
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
            onLogout={handleLogout} // Passed here
            targetRankId={selectedRankId} 
        />
      )}

      {gameState === 'FINISHED' && callsign && (
        <ResultScreen 
          score={finalScore} 
          total={totalQuestionsPlayed} 
          callsign={callsign} 
          onRestart={handleRestart} 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;

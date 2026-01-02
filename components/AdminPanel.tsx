import React, { useState, useEffect } from 'react';
import { StorageUtils } from '../utils/storage';
import { Copy, Save, AlertTriangle, LogOut, Database, Users, Activity } from 'lucide-react';
import { GameHistory } from '../types';

interface UserStat {
  name: string;
  totalGames: number;
  passedGames: number;
  avgScore: number;
  lastPlayed: number;
}

const AdminPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DATABASE'>('OVERVIEW');
  const [userStats, setUserStats] = useState<UserStat[]>([]);
  
  // Database State
  const [jsonInput, setJsonInput] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Load Data
    const rawData = StorageUtils.exportAllData();
    setJsonInput(JSON.stringify(rawData, null, 2));

    // Calculate Stats
    const history = rawData.history as GameHistory[];
    const users = rawData.users as string[];

    // Filter out the admin itself from stats
    const realUsers = users.filter(u => u.toLowerCase() !== 'crimescene');

    const stats: UserStat[] = realUsers.map(user => {
        const userGames = history.filter(h => h.user === user);
        const totalGames = userGames.length;
        const passedGames = userGames.filter(g => g.passed).length;
        
        let avgScore = 0;
        let lastPlayed = 0;

        if (totalGames > 0) {
            const totalScore = userGames.reduce((acc, curr) => acc + curr.score, 0);
            avgScore = totalScore / totalGames; // Raw average
            
            // Find most recent timestamp
            lastPlayed = Math.max(...userGames.map(g => g.timestamp));
        }

        return {
            name: user,
            totalGames,
            passedGames,
            avgScore,
            lastPlayed
        };
    });

    // Sort by most recent activity
    stats.sort((a, b) => b.lastPlayed - a.lastPlayed);

    setUserStats(stats);
  }, []);

  const handleSave = () => {
    const success = StorageUtils.importData(jsonInput);
    if (success) {
      setStatus('Data saved successfully to LocalStorage!');
      setTimeout(() => setStatus(''), 3000);
      // Reload stats
      window.location.reload(); // Simple reload to refresh app state with new data
    } else {
      setStatus('ERROR: Invalid JSON format.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonInput);
    setStatus('Copied to clipboard.');
    setTimeout(() => setStatus(''), 3000);
  };

  const formatDate = (ts: number) => {
      if (ts === 0) return 'NEVER';
      return new Date(ts).toLocaleString('fi-FI');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-10 font-mono">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3 text-emerald-500">
            <AlertTriangle size={24} />
            <h1 className="text-2xl font-bold uppercase tracking-widest">
                Admin Terminal // ACCESS GRANTED
            </h1>
        </div>
        <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-200 uppercase text-sm"
        >
            <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button 
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex items-center gap-2 px-4 py-2 border ${activeTab === 'OVERVIEW' ? 'bg-emerald-900/20 border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
            <Users size={18} /> OPERATORS
        </button>
        <button 
            onClick={() => setActiveTab('DATABASE')}
            className={`flex items-center gap-2 px-4 py-2 border ${activeTab === 'DATABASE' ? 'bg-emerald-900/20 border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
            <Database size={18} /> DATABASE (JSON)
        </button>
      </div>

      {/* Content */}
      {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userStats.length === 0 && (
                  <div className="col-span-full text-slate-500 italic">No user data found.</div>
              )}
              
              {userStats.map((stat) => (
                  <div key={stat.name} className="bg-slate-900 border border-slate-700 p-6 relative group hover:border-emerald-500 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold uppercase text-slate-100">{stat.name}</h3>
                          {stat.totalGames > 0 && (
                              <div className={`px-2 py-1 text-xs font-bold ${stat.passedGames / stat.totalGames > 0.5 ? 'bg-emerald-900/50 text-emerald-500' : 'bg-rose-900/50 text-rose-500'}`}>
                                  {Math.round((stat.passedGames / stat.totalGames) * 100)}% PASS
                              </div>
                          )}
                      </div>
                      
                      <div className="space-y-2 text-sm text-slate-400">
                          <div className="flex justify-between">
                              <span>Missions Attempted:</span>
                              <span className="text-slate-200">{stat.totalGames}</span>
                          </div>
                          <div className="flex justify-between">
                              <span>Missions Passed:</span>
                              <span className="text-slate-200">{stat.passedGames}</span>
                          </div>
                          <div className="flex justify-between">
                              <span>Last Active:</span>
                              <span className="text-xs mt-1">{formatDate(stat.lastPlayed)}</span>
                          </div>
                      </div>

                      <div className="absolute top-0 right-0 w-2 h-2 bg-slate-700 group-hover:bg-emerald-500"></div>
                      <div className="absolute bottom-0 left-0 w-2 h-2 bg-slate-700 group-hover:bg-emerald-500"></div>
                  </div>
              ))}
          </div>
      )}

      {activeTab === 'DATABASE' && (
          <div className="w-full max-w-4xl">
             <div className="bg-slate-900 border border-slate-700 p-4 mb-4">
                <p className="font-mono text-sm text-slate-400 mb-2">
                    RAW DATA MANAGEMENT (Import/Export)
                </p>
                <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full h-96 bg-slate-950 border border-slate-800 text-emerald-500 font-mono text-xs p-4 focus:border-emerald-500 outline-none"
                    spellCheck={false}
                />
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 font-mono text-sm uppercase"
                >
                    <Save size={16} /> Load JSON to App
                </button>
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 font-mono text-sm uppercase"
                >
                    <Copy size={16} /> Copy JSON
                </button>
            </div>

            {status && (
                <div className="mt-4 p-2 border border-emerald-500 text-emerald-500 font-mono text-sm bg-emerald-900/20">
                    {status}
                </div>
            )}
          </div>
      )}

    </div>
  );
};

export default AdminPanel;
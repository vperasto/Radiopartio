
import React, { useState, useEffect } from 'react';
import { StorageUtils } from '../utils/storage';
import { Copy, Save, AlertTriangle, LogOut, Database, Users, Activity, FileJson, List, Shield } from 'lucide-react';
import { GameHistory } from '../types';

interface UserStat {
  name: string;
  totalGames: number;
  passedGames: number;
  avgScore: number;
  lastPlayed: number;
  favoriteCallsign: string;
}

const AdminPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DATABASE'>('OVERVIEW');
  const [dbSection, setDbSection] = useState<'QUESTIONS' | 'USERS' | 'FULL'>('QUESTIONS');
  
  const [userStats, setUserStats] = useState<UserStat[]>([]);
  const [jsonInput, setJsonInput] = useState('');
  const [status, setStatus] = useState('');

  // Initial Data Load for Stats
  useEffect(() => {
    const rawData = StorageUtils.exportAllData();
    
    // Stats Logic
    const history = rawData.history as GameHistory[];
    const users = rawData.users as string[];
    const realUsers = users.filter(u => u.toLowerCase() !== 'crimescene');

    const stats: UserStat[] = realUsers.map(user => {
        const userGames = history.filter(h => h.user === user);
        const totalGames = userGames.length;
        const passedGames = userGames.filter(g => g.passed).length;
        
        let avgScore = 0;
        let lastPlayed = 0;
        let favoriteCallsign = '-';

        if (totalGames > 0) {
            const totalScore = userGames.reduce((acc, curr) => acc + curr.score, 0);
            avgScore = totalScore / totalGames;
            lastPlayed = Math.max(...userGames.map(g => g.timestamp));
            const callsignCounts: Record<string, number> = {};
            userGames.forEach(g => {
                if (g.callsign) callsignCounts[g.callsign] = (callsignCounts[g.callsign] || 0) + 1;
            });
            let maxCount = 0;
            Object.entries(callsignCounts).forEach(([sign, count]) => {
                if (count > maxCount) { maxCount = count; favoriteCallsign = sign; }
            });
        }
        return { name: user, totalGames, passedGames, avgScore, lastPlayed, favoriteCallsign };
    });
    stats.sort((a, b) => b.lastPlayed - a.lastPlayed);
    setUserStats(stats);
  }, []);

  // Handle switching Database sections
  useEffect(() => {
      if (activeTab === 'DATABASE') {
          let data: any = {};
          if (dbSection === 'QUESTIONS') {
              data = StorageUtils.getQuestionBank();
          } else if (dbSection === 'USERS') {
              data = StorageUtils.getUsers();
          } else {
              data = StorageUtils.exportAllData();
          }
          setJsonInput(JSON.stringify(data, null, 2));
          setStatus('');
      }
  }, [activeTab, dbSection]);

  const handleSave = () => {
    try {
        const parsed = JSON.parse(jsonInput);
        
        if (dbSection === 'QUESTIONS') {
            if (!Array.isArray(parsed)) throw new Error("Questions must be an array");
            StorageUtils.saveQuestionBank(parsed);
            setStatus('Questions saved successfully!');
        } else if (dbSection === 'USERS') {
            if (!Array.isArray(parsed)) throw new Error("Users must be an array of strings");
            StorageUtils.saveUsers(parsed);
            setStatus('User list updated!');
        } else {
            const success = StorageUtils.importData(jsonInput);
            if (!success) throw new Error("Import failed structure check");
            setStatus('Full backup restored!');
        }
        
        setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
        setStatus(`ERROR: Invalid JSON. ${(e as Error).message}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonInput);
    setStatus('Copied to clipboard.');
    setTimeout(() => setStatus(''), 3000);
  };

  const formatDate = (ts: number) => ts === 0 ? 'NEVER' : new Date(ts).toLocaleString('fi-FI');

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

      {/* Main Tabs */}
      <div className="flex gap-4 mb-6">
        <button 
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex items-center gap-2 px-4 py-2 border ${activeTab === 'OVERVIEW' ? 'bg-emerald-900/20 border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
            <Activity size={18} /> OVERVIEW
        </button>
        <button 
            onClick={() => setActiveTab('DATABASE')}
            className={`flex items-center gap-2 px-4 py-2 border ${activeTab === 'DATABASE' ? 'bg-emerald-900/20 border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
            <Database size={18} /> DATABASE
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
                              <span>Top Callsign:</span>
                              <span className="text-emerald-400 font-bold">{stat.favoriteCallsign}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-slate-800">
                              <span>Last Active:</span>
                              <span className="text-xs mt-1">{formatDate(stat.lastPlayed)}</span>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {activeTab === 'DATABASE' && (
          <div className="w-full max-w-5xl">
             <div className="flex gap-2 mb-4">
                 <button 
                    onClick={() => setDbSection('QUESTIONS')} 
                    className={`px-3 py-1 text-sm font-bold uppercase flex items-center gap-2 ${dbSection === 'QUESTIONS' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                    <List size={16} /> Questions
                 </button>
                 <button 
                    onClick={() => setDbSection('USERS')} 
                    className={`px-3 py-1 text-sm font-bold uppercase flex items-center gap-2 ${dbSection === 'USERS' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                    <Users size={16} /> Users
                 </button>
                 <button 
                    onClick={() => setDbSection('FULL')} 
                    className={`px-3 py-1 text-sm font-bold uppercase flex items-center gap-2 ${dbSection === 'FULL' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                    <Shield size={16} /> Full Backup
                 </button>
             </div>

             <div className="bg-slate-900 border border-slate-700 p-4 mb-4 relative">
                <div className="flex justify-between items-center mb-2">
                    <p className="font-mono text-sm text-slate-400">
                        EDITING: <span className="text-emerald-500 font-bold">{dbSection}</span>
                    </p>
                    <div className="text-[10px] text-slate-600 font-mono">
                        Supports JSON format only. No comments.
                    </div>
                </div>
                
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
                    className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 font-mono text-sm uppercase rounded-sm"
                >
                    <Save size={16} /> 
                    {dbSection === 'FULL' ? 'RESTORE FULL BACKUP' : `SAVE ${dbSection}`}
                </button>
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 font-mono text-sm uppercase rounded-sm"
                >
                    <Copy size={16} /> Copy JSON
                </button>
            </div>

            {status && (
                <div className={`mt-4 p-2 border font-mono text-sm ${status.includes('ERROR') ? 'border-rose-500 text-rose-500 bg-rose-900/20' : 'border-emerald-500 text-emerald-500 bg-emerald-900/20'}`}>
                    {status}
                </div>
            )}
          </div>
      )}

    </div>
  );
};

export default AdminPanel;

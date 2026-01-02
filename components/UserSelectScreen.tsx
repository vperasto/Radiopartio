import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Plus, ChevronRight, UserCircle, Lock, ArrowLeft, KeyRound } from 'lucide-react';
import { StorageUtils } from '../utils/storage';

interface UserSelectScreenProps {
  onUserSelect: (user: string) => void;
  onAdminLogin: () => void;
}

const UserSelectScreen: React.FC<UserSelectScreenProps> = ({ onUserSelect, onAdminLogin }) => {
  const [users, setUsers] = useState<string[]>([]);
  const [newUser, setNewUser] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  // Admin Login State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState(false);

  useEffect(() => {
    setUsers(StorageUtils.getUsers());
  }, []);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.trim()) {
      StorageUtils.addUser(newUser.trim());
      setUsers(StorageUtils.getUsers());
      onUserSelect(newUser.trim());
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (adminPassword.toLowerCase() === 'crimescene') {
          onAdminLogin();
      } else {
          setAdminError(true);
          setAdminPassword('');
          setTimeout(() => setAdminError(false), 2000);
      }
  };

  // Filter out the secret admin user from the display list just in case it exists in legacy data
  const visibleUsers = users.filter(u => u.toLowerCase() !== 'crimescene');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-md md:max-w-3xl mx-auto transition-all duration-300 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <UserCircle size={64} className="mx-auto text-emerald-500 mb-4" strokeWidth={1.5} />
        <h1 className="text-2xl font-mono font-bold text-slate-100 uppercase tracking-widest">
          {isAdminMode ? 'Ylläpito' : 'Tunnistautuminen'}
        </h1>
        <div className="h-px w-32 bg-emerald-500 mx-auto mt-4"></div>
      </motion.div>

      <AnimatePresence mode="wait">
          {!isAdminMode ? (
            /* NORMAL USER SELECTION */
            <motion.div 
                key="user-select"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full flex flex-col items-center"
            >
                {/* User List - Grid on Desktop */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {visibleUsers.map((user, index) => (
                    <motion.button
                        key={user}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onUserSelect(user)}
                        className="w-full flex items-center justify-between p-4 border border-slate-600 bg-slate-800/50 hover:border-emerald-500 hover:bg-slate-800 transition-all group rounded-sm"
                    >
                        <div className="flex items-center gap-3">
                        <User size={20} className="text-slate-400 group-hover:text-emerald-500" />
                        <span className="font-mono text-lg text-slate-200 uppercase truncate">{user}</span>
                        </div>
                        <ChevronRight className="text-slate-600 group-hover:text-emerald-500" />
                    </motion.button>
                    ))}
                </div>

                {/* Add New User */}
                {isAdding ? (
                    <form onSubmit={handleAddUser} className="w-full max-w-md mx-auto">
                    <div className="flex gap-2">
                        <input
                        type="text"
                        value={newUser}
                        onChange={(e) => setNewUser(e.target.value)}
                        placeholder="NIMI..."
                        className="flex-1 bg-slate-900 border border-emerald-500 p-4 font-mono text-slate-100 placeholder:text-slate-600 outline-none uppercase"
                        autoFocus
                        />
                        <button 
                        type="submit"
                        className="bg-emerald-600 text-white px-6 font-mono font-bold hover:bg-emerald-500"
                        >
                        OK
                        </button>
                    </div>
                    </form>
                ) : (
                    <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 font-mono text-sm uppercase tracking-widest transition-colors"
                    >
                    <Plus size={16} />
                    Uusi Käyttäjä
                    </button>
                )}
            </motion.div>
          ) : (
            /* ADMIN LOGIN */
            <motion.div
                key="admin-login"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="w-full max-w-sm"
            >
                <form onSubmit={handleAdminSubmit} className="flex flex-col gap-4">
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500">
                            <KeyRound size={20} />
                        </div>
                        <input 
                            type="password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder="SALASANA"
                            autoFocus
                            className={`w-full bg-slate-900 border-2 p-4 pl-12 font-mono text-slate-100 placeholder:text-slate-600 outline-none rounded-sm transition-colors ${adminError ? 'border-rose-500' : 'border-slate-600 focus:border-emerald-500'}`}
                        />
                    </div>
                    
                    {adminError && (
                        <p className="text-rose-500 font-mono text-xs text-center uppercase animate-pulse">
                            Pääsy evätty: Väärä salasana
                        </p>
                    )}

                    <button 
                        type="submit"
                        className="w-full bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white border border-slate-600 hover:border-emerald-500 p-4 font-mono font-bold uppercase tracking-widest transition-all rounded-sm"
                    >
                        Kirjaudu
                    </button>

                    <button 
                        type="button"
                        onClick={() => {
                            setIsAdminMode(false);
                            setAdminPassword('');
                            setAdminError(false);
                        }}
                        className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-300 font-mono text-xs uppercase mt-4"
                    >
                        <ArrowLeft size={14} /> Takaisin
                    </button>
                </form>
            </motion.div>
          )}
      </AnimatePresence>

      {!isAdminMode && (
          <div className="absolute bottom-6 w-full flex justify-center">
            <button
                onClick={() => setIsAdminMode(true)}
                className="flex items-center gap-2 text-slate-700 hover:text-slate-500 font-mono text-xs uppercase tracking-widest transition-colors opacity-50 hover:opacity-100"
            >
                <Lock size={12} />
                Ylläpito
            </button>
          </div>
      )}
    </div>
  );
};

export default UserSelectScreen;
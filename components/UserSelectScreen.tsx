import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Plus, ChevronRight, UserCircle } from 'lucide-react';
import { StorageUtils } from '../utils/storage';

interface UserSelectScreenProps {
  onUserSelect: (user: string) => void;
}

const UserSelectScreen: React.FC<UserSelectScreenProps> = ({ onUserSelect }) => {
  const [users, setUsers] = useState<string[]>([]);
  const [newUser, setNewUser] = useState('');
  const [isAdding, setIsAdding] = useState(false);

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

  // Filter out the secret admin user from the display list
  const visibleUsers = users.filter(u => u.toLowerCase() !== 'crimescene');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-md md:max-w-3xl mx-auto transition-all duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <UserCircle size={64} className="mx-auto text-emerald-500 mb-4" strokeWidth={1.5} />
        <h1 className="text-2xl font-mono font-bold text-slate-100 uppercase tracking-widest">
          Tunnistautuminen
        </h1>
        <div className="h-px w-32 bg-emerald-500 mx-auto mt-4"></div>
      </motion.div>

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

      <div className="mt-12 text-xs text-slate-700 font-mono text-center">
        SECURITY LEVEL: UNCLASSIFIED<br/>
        LOCAL TERMINAL ACCESS ONLY
      </div>
    </div>
  );
};

export default UserSelectScreen;
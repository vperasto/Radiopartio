
import { GameHistory, QuestionCategory } from '../types';
import { INITIAL_QUESTION_BANK } from '../constants';

const KEYS = {
  USERS: 'radiopartio_users',
  LAST_USER: 'radiopartio_last_user',
  LAST_CALLSIGN: 'radiopartio_last_callsign', // New persistence key
  HISTORY: 'radiopartio_history',
  QUESTIONS: 'radiopartio_questions_v5', 
  AVATARS: 'radiopartio_avatars',
};

export const StorageUtils = {
  // --- USERS ---
  getUsers: (): string[] => {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  addUser: (name: string) => {
    const users = StorageUtils.getUsers();
    const exists = users.some(u => u.toLowerCase() === name.toLowerCase());
    if (!exists) {
      users.push(name);
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    }
  },

  // Added ability to overwrite users list (for admin)
  saveUsers: (users: string[]) => {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  // --- SESSION PERSISTENCE ---
  getLastUser: (): string | null => {
      return localStorage.getItem(KEYS.LAST_USER);
  },

  setLastUser: (name: string) => {
      localStorage.setItem(KEYS.LAST_USER, name);
  },

  getLastCallsign: (): string | null => {
      return localStorage.getItem(KEYS.LAST_CALLSIGN);
  },

  setLastCallsign: (callsign: string) => {
      localStorage.setItem(KEYS.LAST_CALLSIGN, callsign);
  },

  clearSession: () => {
      localStorage.removeItem(KEYS.LAST_USER);
      localStorage.removeItem(KEYS.LAST_CALLSIGN);
  },
  
  clearCallsign: () => {
      localStorage.removeItem(KEYS.LAST_CALLSIGN);
  },

  // --- AVATARS ---
  getUserAvatar: (user: string): string => {
      const data = localStorage.getItem(KEYS.AVATARS);
      const avatars = data ? JSON.parse(data) : {};
      return avatars[user] || 'default';
  },

  saveUserAvatar: (user: string, avatarId: string) => {
      const data = localStorage.getItem(KEYS.AVATARS);
      const avatars = data ? JSON.parse(data) : {};
      avatars[user] = avatarId;
      localStorage.setItem(KEYS.AVATARS, JSON.stringify(avatars));
  },

  // --- HISTORY ---
  getHistory: (): GameHistory[] => {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  },

  saveGameResult: (result: GameHistory) => {
    const history = StorageUtils.getHistory();
    history.push(result);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  },

  getUserHistory: (name: string): GameHistory[] => {
    return StorageUtils.getHistory().filter(h => h.user === name);
  },

  // --- QUESTIONS ---
  getQuestionBank: (): QuestionCategory[] => {
    const data = localStorage.getItem(KEYS.QUESTIONS);
    if (!data) {
      localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTION_BANK));
      return INITIAL_QUESTION_BANK;
    }
    return JSON.parse(data);
  },

  saveQuestionBank: (data: QuestionCategory[]) => {
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(data));
  },

  // --- RAW DATA EXPORT/IMPORT ---
  exportAllData: () => {
    return {
      users: StorageUtils.getUsers(),
      history: StorageUtils.getHistory(),
      questions: StorageUtils.getQuestionBank(),
      avatars: localStorage.getItem(KEYS.AVATARS) ? JSON.parse(localStorage.getItem(KEYS.AVATARS)!) : {}
    };
  },

  importData: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.users) localStorage.setItem(KEYS.USERS, JSON.stringify(data.users));
      if (data.history) localStorage.setItem(KEYS.HISTORY, JSON.stringify(data.history));
      if (data.questions) localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(data.questions));
      if (data.avatars) localStorage.setItem(KEYS.AVATARS, JSON.stringify(data.avatars));
      return true;
    } catch (e) {
      console.error("Import failed", e);
      return false;
    }
  }
};

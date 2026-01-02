export type GameState = 'USER_SELECT' | 'START' | 'MANUAL' | 'PLAYING' | 'FINISHED' | 'ADMIN_DASHBOARD';

export type Callsign = 'Haukka' | 'Karhu' | 'Susi' | 'Ilves' | 'Salama' | 'Myrsky' | 'Kallio' | 'Varjo' | 'Kaiku' | 'Halla';

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  PTT_TIMING = 'PTT_TIMING',
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

// A specific instance of a question (Variant)
export interface QuestionVariant {
  id: string;
  scenario: string;
  type: QuestionType;
  options: Option[];
  pttInstruction?: string;
}

// A category containing multiple variations of the same learning goal
export interface QuestionCategory {
  id: string;
  title: string; // e.g., "PROTOKOLLA"
  variants: QuestionVariant[];
}

export interface PlayerStats {
  callsign: Callsign | null;
  score: number;
  totalQuestions: number;
  completedQuestions: number;
}

export interface ManualPage {
  id: number;
  title: string;
  icon: string;
  content: string;
}

export interface GameHistory {
  id: string;
  timestamp: number;
  user: string;
  callsign: string;
  score: number;
  total: number;
  passed: boolean;
}

export interface UserProfile {
  name: string;
  gamesPlayed: number;
  totalScore: number;
}
export type Subject = "Math" | "Science" | "GK";
export type Difficulty = "easy" | "medium" | "hard";
export type GameMode = "knowledge" | "reward";
export type HintType = "map" | "riddle" | "compass" | "glow";

export interface Question {
  id: string;
  subject: Subject;
  difficulty: Difficulty;
  prompt: string;
  options: string[];
  answerIndex: number;
  solution: string;
  hintType?: HintType;
  nextClue?: string;
}

export interface Level {
  id: string;
  name: string;
  background: string;
  music: string;
  platforms: { x: number; y: number; width: number; height: number }[];
  treasureBoxes: { x: number; y: number; id: string }[];
  playerSpawn: { x: number; y: number };
  requiredAnswers: number;
  ambientSounds: string[];
}

export interface GameState {
  mode: GameMode;
  subject: Subject;
  levelIndex: number;
  correctThisLevel: number;
  totalCoins: number;
  completedBoxIds: string[];
  currentQuestionId?: string;
  currentBoxId?: string;
  attempts: number;
  score: number;
  hintsUsed: number;
  gameStarted: boolean;
  gamePaused: boolean;
}

export interface PlayerStats {
  totalQuestionsAnswered: number;
  correctAnswers: number;
  levelsCompleted: number;
  coinsCollected: number;
}
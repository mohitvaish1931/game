import { create } from 'zustand';
import { GameState, Subject, GameMode } from '../../types';

interface GameStore extends GameState {
  // Actions
  setMode: (mode: GameMode) => void;
  setSubject: (subject: Subject) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  nextLevel: () => void;
  resetLevel: () => void;
  addCoins: (amount: number) => void;
  incrementScore: (points: number) => void;
  markBoxCompleted: (boxId: string) => void;
  setCurrentQuestion: (questionId: string) => void;
  setCurrentBox: (boxId: string) => void;
  clearCurrentQuestion: () => void;
  incrementCorrect: () => void;
  resetAttempts: () => void;
  decrementAttempts: () => void;
  incrementHintsUsed: () => void;
  resetGame: () => void;
}

const initialState: GameState = {
  mode: 'knowledge',
  subject: 'Math',
  levelIndex: 0,
  correctThisLevel: 0,
  totalCoins: 0,
  completedBoxIds: [],
  currentQuestionId: undefined,
  currentBoxId: undefined,
  attempts: 3,
  score: 0,
  hintsUsed: 0,
  gameStarted: false,
  gamePaused: false,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  setMode: (mode) => set({ mode }),
  
  setSubject: (subject) => set({ subject }),
  
  startGame: () => set({ 
    gameStarted: true, 
    gamePaused: false,
    levelIndex: 0,
    correctThisLevel: 0,
    completedBoxIds: [],
    score: 0,
    totalCoins: 0,
    hintsUsed: 0
  }),
  
  pauseGame: () => set({ gamePaused: true }),
  
  resumeGame: () => set({ gamePaused: false }),
  
  nextLevel: () => set((state) => ({ 
    levelIndex: state.levelIndex + 1,
    correctThisLevel: 0,
    completedBoxIds: []
  })),
  
  resetLevel: () => set({ 
    correctThisLevel: 0, 
    completedBoxIds: [],
    currentQuestionId: undefined,
    currentBoxId: undefined,
    attempts: 3
  }),
  
  addCoins: (amount) => set((state) => ({ 
    totalCoins: state.totalCoins + amount 
  })),
  
  incrementScore: (points) => set((state) => ({ 
    score: state.score + points 
  })),
  
  markBoxCompleted: (boxId) => set((state) => ({
    completedBoxIds: [...state.completedBoxIds, boxId]
  })),
  
  setCurrentQuestion: (questionId) => set({ 
    currentQuestionId: questionId,
    attempts: 3
  }),
  
  setCurrentBox: (boxId) => set({ currentBoxId: boxId }),
  
  clearCurrentQuestion: () => set({ 
    currentQuestionId: undefined,
    attempts: 3
  }),
  
  incrementCorrect: () => set((state) => ({ 
    correctThisLevel: state.correctThisLevel + 1 
  })),
  
  resetAttempts: () => set({ attempts: 3 }),
  
  decrementAttempts: () => set((state) => ({ 
    attempts: Math.max(0, state.attempts - 1) 
  })),
  
  incrementHintsUsed: () => set((state) => ({ 
    hintsUsed: state.hintsUsed + 1 
  })),
  
  resetGame: () => set(initialState),
}));
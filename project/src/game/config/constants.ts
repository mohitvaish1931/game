export const GAME_CONFIG = {
  WIDTH: 1024,
  HEIGHT: 576,
  PHYSICS: {
    GRAVITY: 800,
    PLAYER_SPEED: 200,
    JUMP_VELOCITY: -400,
  },
  UI: {
    MAX_ATTEMPTS: 3,
    COINS_PER_CORRECT: 10,
    HINT_DISPLAY_TIME: 3000,
  },
  CONTROLS: {
    KEYBOARD: {
      LEFT: 'A',
      RIGHT: 'D',
      JUMP: 'W',
      INTERACT: 'E',
    },
    MOBILE: {
      JOYSTICK_SIZE: 100,
      BUTTON_SIZE: 60,
    },
  },
  SCENES: {
    BOOT: 'BootScene',
    PRELOAD: 'PreloadScene',
    MENU: 'MenuScene',
    WORLD: 'WorldScene',
    QUESTION: 'QuestionScene',
    HUD: 'HUDScene',
    RESULT: 'ResultScene',
  },
  AUDIO: {
    MUSIC_VOLUME: 0.6,
    SFX_VOLUME: 0.8,
  },
};

export const COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#14B8A6',
  ACCENT: '#F97316',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  BACKGROUND: '#1F2937',
  TEXT: '#F9FAFB',
};

export const LEVEL_THEMES = {
  JUNGLE: {
    primary: '#22C55E',
    secondary: '#15803D',
    accent: '#FCD34D',
  },
  CITY: {
    primary: '#6366F1',
    secondary: '#4F46E5',
    accent: '#EC4899',
  },
  DESERT: {
    primary: '#F59E0B',
    secondary: '#D97706',
    accent: '#DC2626',
  },
};
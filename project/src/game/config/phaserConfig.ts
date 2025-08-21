import Phaser from 'phaser';
import { GAME_CONFIG } from './constants';
import BootScene from '../scenes/BootScene';
import PreloadScene from '../scenes/PreloadScene';
import MenuScene from '../scenes/MenuScene';
import WorldScene from '../scenes/WorldScene';
import QuestionScene from '../scenes/QuestionScene';
import HUDScene from '../scenes/HUDScene';
import ResultScene from '../scenes/ResultScene';

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_CONFIG.WIDTH,
  height: GAME_CONFIG.HEIGHT,
  parent: 'phaser-game',
  backgroundColor: '#2C5530',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 320,
      height: 180
    },
    max: {
      width: 1920,
      height: 1080
    }
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: GAME_CONFIG.PHYSICS.GRAVITY, x: 0 },
      debug: false
    }
  },
  scene: [
    BootScene,
    PreloadScene,
    MenuScene,
    WorldScene,
    QuestionScene,
    HUDScene,
    ResultScene
  ],
  audio: {
    disableWebAudio: false
  },
  input: {
    touch: true,
    gamepad: false
  }
};
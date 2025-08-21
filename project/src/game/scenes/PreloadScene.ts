import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/constants';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: GAME_CONFIG.SCENES.PRELOAD });
  }

  preload(): void {
    // Create placeholder sprites using graphics
    this.createPlaceholderSprites();
    
    // Placeholder audio files (silent)
    this.createPlaceholderAudio();
    
    // Show loading progress
    this.createLoadingProgress();
  }

  private createPlaceholderSprites(): void {
    // Player sprite
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(0x4A90E2);
    playerGraphics.fillRect(0, 0, 24, 32);
    playerGraphics.generateTexture('player', 24, 32);
    playerGraphics.destroy();

    // Treasure box sprite
    const boxGraphics = this.add.graphics();
    boxGraphics.fillStyle(0x8B4513);
    boxGraphics.fillRect(0, 0, 40, 32);
    boxGraphics.lineStyle(2, 0xFFD700);
    boxGraphics.strokeRect(0, 0, 40, 32);
    boxGraphics.generateTexture('treasurebox', 40, 32);
    boxGraphics.destroy();

    // Platform sprite
    const platformGraphics = this.add.graphics();
    platformGraphics.fillStyle(0x228B22);
    platformGraphics.fillRect(0, 0, 32, 32);
    platformGraphics.generateTexture('platform', 32, 32);
    platformGraphics.destroy();

    // Collectible sprite
    const collectibleGraphics = this.add.graphics();
    collectibleGraphics.fillStyle(0xFFD700);
    collectibleGraphics.fillCircle(8, 8, 8);
    collectibleGraphics.generateTexture('collectible', 16, 16);
    collectibleGraphics.destroy();

    // Background textures
    this.createBackgroundTextures();
  }

  private createBackgroundTextures(): void {
    // Jungle background
    const jungleGraphics = this.add.graphics();
    const gradient = jungleGraphics.createLinearGradient(0, 0, 0, GAME_CONFIG.HEIGHT);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.7, '#228B22'); // Forest green
    gradient.addColorStop(1, '#006400'); // Dark green
    jungleGraphics.fillGradientStyle(gradient);
    jungleGraphics.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
    jungleGraphics.generateTexture('jungle-bg', GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
    jungleGraphics.destroy();

    // City background
    const cityGraphics = this.add.graphics();
    const cityGradient = cityGraphics.createLinearGradient(0, 0, 0, GAME_CONFIG.HEIGHT);
    cityGradient.addColorStop(0, '#87CEFA'); // Light sky blue
    cityGradient.addColorStop(0.6, '#4682B4'); // Steel blue
    cityGradient.addColorStop(1, '#2F4F4F'); // Dark slate gray
    cityGraphics.fillGradientStyle(cityGradient);
    cityGraphics.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
    cityGraphics.generateTexture('city-bg', GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
    cityGraphics.destroy();

    // Desert background
    const desertGraphics = this.add.graphics();
    const desertGradient = desertGraphics.createLinearGradient(0, 0, 0, GAME_CONFIG.HEIGHT);
    desertGradient.addColorStop(0, '#FFE4B5'); // Moccasin
    desertGradient.addColorStop(0.5, '#DEB887'); // Burlywood
    desertGradient.addColorStop(1, '#D2691E'); // Chocolate
    desertGraphics.fillGradientStyle(desertGradient);
    desertGraphics.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
    desertGraphics.generateTexture('desert-bg', GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
    desertGraphics.destroy();
  }

  private createPlaceholderAudio(): void {
    // Create silent audio context for placeholder sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a short silent audio buffer
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * 0.1, sampleRate); // 0.1 second of silence
    
    // Convert to data URL (this is a simplified approach)
    // In a real game, you'd load actual audio files
    const silentAudio = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhBAAAAAAAAAA=';
    
    // Load placeholder sounds
    this.load.audio('jungle-music', [silentAudio]);
    this.load.audio('city-music', [silentAudio]);
    this.load.audio('desert-music', [silentAudio]);
    this.load.audio('correct-sound', [silentAudio]);
    this.load.audio('wrong-sound', [silentAudio]);
    this.load.audio('collect-sound', [silentAudio]);
    this.load.audio('box-open-sound', [silentAudio]);
    this.load.audio('jump-sound', [silentAudio]);
  }

  private createLoadingProgress(): void {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    
    const progressText = this.add.text(centerX, centerY, 'Loading Game Assets...', {
      fontSize: '24px',
      color: '#FFFFFF'
    }).setOrigin(0.5);

    this.load.on('complete', () => {
      progressText.setText('Ready to Play!');
      
      // Short delay then start menu
      this.time.delayedCall(1000, () => {
        this.scene.start(GAME_CONFIG.SCENES.MENU);
      });
    });
  }

  create(): void {
    // Assets are loaded, ready to proceed
  }
}
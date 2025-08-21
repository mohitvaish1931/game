import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/constants';
import { useGameStore } from '../state/store';
import { getCurrentLevel, getNextLevel } from '../config/levels';

export default class ResultScene extends Phaser.Scene {
  private gameStore: any;
  private currentLevel: any;
  private nextLevel: any;

  constructor() {
    super({ key: GAME_CONFIG.SCENES.RESULT });
  }

  init(): void {
    this.gameStore = useGameStore.getState();
    this.currentLevel = getCurrentLevel(this.gameStore.levelIndex);
    this.nextLevel = getNextLevel(this.gameStore.levelIndex);
  }

  create(): void {
    // Background
    this.add.rectangle(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT, 0x000000, 0.8)
      .setOrigin(0, 0);

    // Title
    const title = this.add.text(GAME_CONFIG.WIDTH / 2, 80, 'Level Complete!', {
      fontSize: '48px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Level name
    this.add.text(GAME_CONFIG.WIDTH / 2, 140, this.currentLevel.name, {
      fontSize: '24px',
      color: '#FFFFFF'
    }).setOrigin(0.5);

    // Stats
    this.createStatsDisplay();

    // Buttons
    this.createButtons();

    // Animate in
    this.tweens.add({
      targets: [title],
      scale: { from: 0.5, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 800,
      ease: 'Back.easeOut'
    });
  }

  private createStatsDisplay(): void {
    const centerX = GAME_CONFIG.WIDTH / 2;
    let y = 200;

    // Stats container
    const statsBg = this.add.rectangle(centerX, y + 100, 400, 200, 0x1F2937, 0.9);
    statsBg.setStrokeStyle(2, 0x3B82F6);

    // Stats title
    this.add.text(centerX, y, 'Level Statistics', {
      fontSize: '24px',
      color: '#3B82F6',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    y += 50;

    // Individual stats
    const stats = [
      { label: 'Correct Answers', value: this.gameStore.correctThisLevel, color: '#10B981' },
      { label: 'Total Score', value: this.gameStore.score, color: '#F59E0B' },
      { label: 'Coins Collected', value: this.gameStore.totalCoins, color: '#FFD700' },
      { label: 'Hints Used', value: this.gameStore.hintsUsed, color: '#8B5CF6' }
    ];

    stats.forEach((stat, index) => {
      const statY = y + index * 30;
      
      this.add.text(centerX - 150, statY, stat.label + ':', {
        fontSize: '18px',
        color: '#FFFFFF'
      });

      this.add.text(centerX + 150, statY, stat.value.toString(), {
        fontSize: '18px',
        color: stat.color,
        fontStyle: 'bold'
      }).setOrigin(1, 0);
    });
  }

  private createButtons(): void {
    const centerX = GAME_CONFIG.WIDTH / 2;
    const buttonY = 450;

    if (this.nextLevel) {
      // Next Level button
      const nextButton = this.createButton(centerX - 100, buttonY, 'Next Level', 0x10B981, () => {
        this.gameStore.nextLevel();
        this.scene.start(GAME_CONFIG.SCENES.WORLD);
        this.scene.launch(GAME_CONFIG.SCENES.HUD);
      });

      // Replay Level button
      const replayButton = this.createButton(centerX + 100, buttonY, 'Replay', 0x3B82F6, () => {
        this.gameStore.resetLevel();
        this.scene.start(GAME_CONFIG.SCENES.WORLD);
        this.scene.launch(GAME_CONFIG.SCENES.HUD);
      });
    } else {
      // Game Complete!
      this.add.text(centerX, 350, 'Congratulations!', {
        fontSize: '32px',
        color: '#FFD700',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      this.add.text(centerX, 380, 'You have completed all levels!', {
        fontSize: '18px',
        color: '#FFFFFF'
      }).setOrigin(0.5);

      // Play Again button
      const playAgainButton = this.createButton(centerX, buttonY, 'Play Again', 0x10B981, () => {
        this.gameStore.resetGame();
        this.scene.start(GAME_CONFIG.SCENES.MENU);
      });
    }

    // Main Menu button
    const menuButton = this.createButton(centerX, buttonY + 60, 'Main Menu', 0x6B7280, () => {
      this.scene.start(GAME_CONFIG.SCENES.MENU);
    });
  }

  private createButton(x: number, y: number, text: string, color: number, onClick: () => void): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, 150, 40, color, 0.9);
    const label = this.add.text(0, 0, text, {
      fontSize: '16px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    button.add([bg, label]);
    button.setSize(150, 40);
    button.setInteractive();
    
    button.on('pointerdown', onClick);
    button.on('pointerover', () => {
      bg.setAlpha(1);
      button.setScale(1.05);
    });
    button.on('pointerout', () => {
      bg.setAlpha(0.9);
      button.setScale(1);
    });
    
    return button;
  }
}
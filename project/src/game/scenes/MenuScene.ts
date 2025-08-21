import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/constants';
import { useGameStore } from '../state/store';
import { Subject, GameMode } from '../../types';

export default class MenuScene extends Phaser.Scene {
  private selectedSubject: Subject = 'Math';
  private selectedMode: GameMode = 'knowledge';
  private buttons: { [key: string]: Phaser.GameObjects.Container } = {};

  constructor() {
    super({ key: GAME_CONFIG.SCENES.MENU });
  }

  create(): void {
    // Get game store
    const gameStore = useGameStore.getState();
    
    // Background
    this.add.image(0, 0, 'jungle-bg').setOrigin(0, 0).setAlpha(0.7);
    
    // Title
    const title = this.add.text(GAME_CONFIG.WIDTH / 2, 80, 'Educational Treasure Hunt', {
      fontSize: '36px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Add title shadow
    this.add.text(GAME_CONFIG.WIDTH / 2 + 2, 82, 'Educational Treasure Hunt', {
      fontSize: '36px',
      color: '#000000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(-1);

    // Subject selection
    this.add.text(GAME_CONFIG.WIDTH / 2, 160, 'Choose Subject:', {
      fontSize: '24px',
      color: '#FFFFFF'
    }).setOrigin(0.5);

    this.createSubjectButtons();

    // Mode selection
    this.add.text(GAME_CONFIG.WIDTH / 2, 300, 'Choose Mode:', {
      fontSize: '24px',
      color: '#FFFFFF'
    }).setOrigin(0.5);

    this.createModeButtons();

    // Start button
    this.createStartButton();

    // Instructions
    this.createInstructions();

    // Update initial selection
    this.updateSubjectSelection();
    this.updateModeSelection();
  }

  private createSubjectButtons(): void {
    const subjects: Subject[] = ['Math', 'Science', 'GK'];
    const startX = GAME_CONFIG.WIDTH / 2 - 150;
    const y = 200;

    subjects.forEach((subject, index) => {
      const x = startX + index * 100;
      const button = this.createButton(x, y, subject, () => {
        this.selectedSubject = subject;
        this.updateSubjectSelection();
      });
      
      this.buttons[`subject-${subject}`] = button;
    });
  }

  private createModeButtons(): void {
    const modes: { mode: GameMode; label: string; desc: string }[] = [
      { mode: 'knowledge', label: 'Knowledge', desc: 'Get hints to find treasure' },
      { mode: 'reward', label: 'Reward', desc: 'Collect coins and get hints' }
    ];

    const startX = GAME_CONFIG.WIDTH / 2 - 125;
    const y = 340;

    modes.forEach((modeInfo, index) => {
      const x = startX + index * 250;
      const button = this.createModeButton(x, y, modeInfo.label, modeInfo.desc, () => {
        this.selectedMode = modeInfo.mode;
        this.updateModeSelection();
      });
      
      this.buttons[`mode-${modeInfo.mode}`] = button;
    });
  }

  private createButton(x: number, y: number, text: string, onClick: () => void): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, 90, 40, 0x4A90E2, 0.8);
    const label = this.add.text(0, 0, text, {
      fontSize: '16px',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    
    container.add([bg, label]);
    container.setSize(90, 40);
    container.setInteractive();
    
    container.on('pointerdown', onClick);
    container.on('pointerover', () => {
      bg.setFillStyle(0x5BA0F2);
    });
    container.on('pointerout', () => {
      bg.setFillStyle(0x4A90E2);
    });
    
    return container;
  }

  private createModeButton(x: number, y: number, title: string, desc: string, onClick: () => void): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, 200, 60, 0x2ECC71, 0.8);
    const titleText = this.add.text(0, -10, title, {
      fontSize: '18px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    const descText = this.add.text(0, 10, desc, {
      fontSize: '12px',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    
    container.add([bg, titleText, descText]);
    container.setSize(200, 60);
    container.setInteractive();
    
    container.on('pointerdown', onClick);
    container.on('pointerover', () => {
      bg.setFillStyle(0x3EDC81);
    });
    container.on('pointerout', () => {
      bg.setFillStyle(0x2ECC71);
    });
    
    return container;
  }

  private createStartButton(): void {
    const button = this.add.container(GAME_CONFIG.WIDTH / 2, 450);
    
    const bg = this.add.rectangle(0, 0, 150, 50, 0xE74C3C, 0.9);
    const text = this.add.text(0, 0, 'START GAME', {
      fontSize: '20px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    button.add([bg, text]);
    button.setSize(150, 50);
    button.setInteractive();
    
    button.on('pointerdown', () => {
      this.startGame();
    });
    button.on('pointerover', () => {
      bg.setFillStyle(0xF75C4C);
    });
    button.on('pointerout', () => {
      bg.setFillStyle(0xE74C3C);
    });
  }

  private createInstructions(): void {
    const instructions = [
      'Controls: Arrow keys or WASD to move, E to interact',
      'Find treasure boxes and answer questions correctly',
      'Use hints to locate the next treasure box',
      'Complete all treasures to advance to the next level'
    ];
    
    const startY = 500;
    instructions.forEach((instruction, index) => {
      this.add.text(GAME_CONFIG.WIDTH / 2, startY + index * 20, instruction, {
        fontSize: '14px',
        color: '#CCCCCC'
      }).setOrigin(0.5);
    });
  }

  private updateSubjectSelection(): void {
    Object.keys(this.buttons).forEach(key => {
      if (key.startsWith('subject-')) {
        const button = this.buttons[key];
        const bg = button.list[0] as Phaser.GameObjects.Rectangle;
        const subject = key.replace('subject-', '');
        
        if (subject === this.selectedSubject) {
          bg.setFillStyle(0xF39C12); // Orange for selected
        } else {
          bg.setFillStyle(0x4A90E2); // Blue for unselected
        }
      }
    });
  }

  private updateModeSelection(): void {
    Object.keys(this.buttons).forEach(key => {
      if (key.startsWith('mode-')) {
        const button = this.buttons[key];
        const bg = button.list[0] as Phaser.GameObjects.Rectangle;
        const mode = key.replace('mode-', '');
        
        if (mode === this.selectedMode) {
          bg.setFillStyle(0x8E44AD); // Purple for selected
        } else {
          bg.setFillStyle(0x2ECC71); // Green for unselected
        }
      }
    });
  }

  private startGame(): void {
    const gameStore = useGameStore.getState();
    
    // Set selected options
    gameStore.setSubject(this.selectedSubject);
    gameStore.setMode(this.selectedMode);
    gameStore.startGame();
    
    // Start the game
    this.scene.start(GAME_CONFIG.SCENES.WORLD);
    this.scene.launch(GAME_CONFIG.SCENES.HUD);
  }
}
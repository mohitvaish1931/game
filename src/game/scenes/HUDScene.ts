import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/constants';
import { useGameStore } from '../state/store';

export default class HUDScene extends Phaser.Scene {
  private coinsText?: Phaser.GameObjects.Text;
  private scoreText?: Phaser.GameObjects.Text;
  private levelText?: Phaser.GameObjects.Text;
  private correctText?: Phaser.GameObjects.Text;
  private subjectText?: Phaser.GameObjects.Text;
  private modeText?: Phaser.GameObjects.Text;
  private attemptsText?: Phaser.GameObjects.Text;
  private pauseButton?: Phaser.GameObjects.Container;
  private mobileControls?: Phaser.GameObjects.Container;
  private joystick?: Phaser.GameObjects.Container;
  private jumpButton?: Phaser.GameObjects.Container;
  private interactButton?: Phaser.GameObjects.Container;
  private gameStore: any;

  constructor() {
    super({ key: GAME_CONFIG.SCENES.HUD });
  }

  create(): void {
    this.gameStore = useGameStore.getState();
    
    // Create HUD background
    const hudBg = this.add.rectangle(0, 0, GAME_CONFIG.WIDTH, 80, 0x000000, 0.7);
    hudBg.setOrigin(0, 0);

    // Create HUD elements
    this.createHUDElements();
    this.createMobileControls();
    this.createPauseButton();

    // Update HUD initially
    this.updateHUD();

    // Set up periodic updates
    this.time.addEvent({
      delay: 100,
      callback: this.updateHUD,
      callbackScope: this,
      loop: true
    });
  }

  private createHUDElements(): void {
    // Coins
    this.add.text(20, 20, '💰', { fontSize: '24px' });
    this.coinsText = this.add.text(50, 25, '0', {
      fontSize: '18px',
      color: '#FFD700',
      fontStyle: 'bold'
    });

    // Score
    this.add.text(150, 20, '⭐', { fontSize: '24px' });
    this.scoreText = this.add.text(180, 25, '0', {
      fontSize: '18px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    });

    // Level
    this.levelText = this.add.text(280, 25, 'Level 1', {
      fontSize: '18px',
      color: '#00FF00',
      fontStyle: 'bold'
    });

    // Correct answers this level
    this.correctText = this.add.text(380, 25, 'Progress: 0/5', {
      fontSize: '16px',
      color: '#FFFFFF'
    });

    // Subject
    this.subjectText = this.add.text(520, 25, 'Math', {
      fontSize: '16px',
      color: '#3B82F6',
      fontStyle: 'bold'
    });

    // Mode
    this.modeText = this.add.text(600, 25, 'Knowledge', {
      fontSize: '16px',
      color: '#10B981',
      fontStyle: 'bold'
    });

    // Attempts (shown during questions)
    this.attemptsText = this.add.text(GAME_CONFIG.WIDTH / 2, 25, '', {
      fontSize: '16px',
      color: '#EF4444',
      fontStyle: 'bold'
    }).setOrigin(0.5).setVisible(false);
  }

  private createMobileControls(): void {
    if (!this.sys.game.device.input.touch) return;

    this.mobileControls = this.add.container(0, 0);

    // Virtual joystick
    this.createVirtualJoystick();

    // Action buttons
    this.createActionButtons();
  }

  private createVirtualJoystick(): void {
    const joystickX = 80;
    const joystickY = GAME_CONFIG.HEIGHT - 80;

    this.joystick = this.add.container(joystickX, joystickY);

    // Joystick base
    const base = this.add.circle(0, 0, 40, 0x333333, 0.5);
    const stick = this.add.circle(0, 0, 20, 0x666666, 0.8);

    this.joystick.add([base, stick]);
    this.mobileControls?.add(this.joystick);

    // Make interactive
    base.setInteractive();
    let isDragging = false;
    let stickPosition = { x: 0, y: 0 };

    base.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      isDragging = true;
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!isDragging) return;

      const distance = Phaser.Math.Distance.Between(
        joystickX, joystickY, pointer.x, pointer.y
      );

      if (distance <= 40) {
        stick.setPosition(pointer.x - joystickX, pointer.y - joystickY);
        stickPosition = { x: pointer.x - joystickX, y: pointer.y - joystickY };
      } else {
        const angle = Phaser.Math.Angle.Between(
          joystickX, joystickY, pointer.x, pointer.y
        );
        stick.setPosition(Math.cos(angle) * 40, Math.sin(angle) * 40);
        stickPosition = { x: Math.cos(angle) * 40, y: Math.sin(angle) * 40 };
      }

      // Emit movement events
      this.events.emit('joystickMove', stickPosition);
    });

    this.input.on('pointerup', () => {
      if (!isDragging) return;
      isDragging = false;
      stick.setPosition(0, 0);
      stickPosition = { x: 0, y: 0 };
      this.events.emit('joystickMove', stickPosition);
    });
  }

  private createActionButtons(): void {
    // Jump button
    this.jumpButton = this.add.container(GAME_CONFIG.WIDTH - 120, GAME_CONFIG.HEIGHT - 80);
    const jumpBg = this.add.circle(0, 0, 30, 0x3B82F6, 0.8);
    const jumpText = this.add.text(0, 0, '↑', {
      fontSize: '24px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.jumpButton.add([jumpBg, jumpText]);
    this.jumpButton.setInteractive(new Phaser.Geom.Circle(0, 0, 30), Phaser.Geom.Circle.Contains);
    this.mobileControls?.add(this.jumpButton);

    this.jumpButton.on('pointerdown', () => {
      this.events.emit('mobileJump');
    });

    // Interact button
    this.interactButton = this.add.container(GAME_CONFIG.WIDTH - 60, GAME_CONFIG.HEIGHT - 80);
    const interactBg = this.add.circle(0, 0, 25, 0x10B981, 0.8);
    const interactText = this.add.text(0, 0, 'E', {
      fontSize: '18px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.interactButton.add([interactBg, interactText]);
    this.interactButton.setInteractive(new Phaser.Geom.Circle(0, 0, 25), Phaser.Geom.Circle.Contains);
    this.mobileControls?.add(this.interactButton);

    this.interactButton.on('pointerdown', () => {
      this.events.emit('mobileInteract');
    });
  }

  private createPauseButton(): void {
    this.pauseButton = this.add.container(GAME_CONFIG.WIDTH - 50, 40);

    const pauseBg = this.add.circle(0, 0, 20, 0x666666, 0.8);
    const pauseIcon = this.add.text(0, 0, '⏸', {
      fontSize: '16px',
      color: '#FFFFFF'
    }).setOrigin(0.5);

    this.pauseButton.add([pauseBg, pauseIcon]);
    this.pauseButton.setInteractive(new Phaser.Geom.Circle(0, 0, 20), Phaser.Geom.Circle.Contains);

    this.pauseButton.on('pointerdown', () => {
      this.scene.pause('WorldScene');
      this.scene.launch('PauseScene');
    });

    this.pauseButton.on('pointerover', () => {
      pauseBg.setFillStyle(0x888888);
    });

    this.pauseButton.on('pointerout', () => {
      pauseBg.setFillStyle(0x666666);
    });
  }

  private updateHUD(): void {
    const state = useGameStore.getState();

    // Update text elements
    this.coinsText?.setText(state.totalCoins.toString());
    this.scoreText?.setText(state.score.toString());
    this.levelText?.setText(`Level ${state.levelIndex + 1}`);
    this.correctText?.setText(`Progress: ${state.correctThisLevel}/5`);
    this.subjectText?.setText(state.subject);
    this.modeText?.setText(state.mode === 'knowledge' ? 'Knowledge' : 'Reward');

    // Show attempts during questions
    if (state.currentQuestionId) {
      this.attemptsText?.setText(`Attempts: ${state.attempts}/3`).setVisible(true);
    } else {
      this.attemptsText?.setVisible(false);
    }
  }

  public showMobileControls(): void {
    this.mobileControls?.setVisible(true);
  }

  public hideMobileControls(): void {
    this.mobileControls?.setVisible(false);
  }
}
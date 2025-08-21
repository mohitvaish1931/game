import Phaser from 'phaser';
import { useGameStore } from '../state/store';

export class TreasureBox extends Phaser.GameObjects.Container {
  private box: Phaser.GameObjects.Rectangle;
  private glow: Phaser.GameObjects.Arc;
  private isCompleted: boolean = false;
  private isActive: boolean = true;
  public boxId: string;
  private glowTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number, boxId: string) {
    super(scene, x, y);
    
    this.boxId = boxId;
    
    // Create the treasure box visual
    this.box = scene.add.rectangle(0, 0, 40, 32, 0x8B4513);
    this.box.setStrokeStyle(2, 0xFFD700);
    
    // Create glow effect
    this.glow = scene.add.circle(0, 0, 25, 0xFFD700, 0.3);
    this.glow.setVisible(false);
    
    // Add to container
    this.add([this.glow, this.box]);
    
    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body
    
    // Set up physics body
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(40, 32);
    
    // Check if this box is already completed
    const gameState = useGameStore.getState();
    this.isCompleted = gameState.completedBoxIds.includes(boxId);
    
    if (this.isCompleted) {
      this.markAsCompleted();
    } else {
      this.startIdleAnimation();
    }
  }

  private startIdleAnimation(): void {
    // Gentle bobbing animation
    this.scene.tweens.add({
      targets: this,
      y: this.y - 5,
      duration: 1500,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
    
    // Occasional sparkle
    this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        if (!this.isCompleted && this.isActive) {
          this.sparkle();
        }
      },
      loop: true
    });
  }

  private sparkle(): void {
    const sparkle = this.scene.add.circle(
      this.x + Phaser.Math.Between(-20, 20),
      this.y + Phaser.Math.Between(-20, 20),
      3,
      0xFFFFFF,
      0.8
    );
    
    this.scene.tweens.add({
      targets: sparkle,
      alpha: 0,
      scale: 1.5,
      duration: 800,
      ease: 'Power2',
      onComplete: () => sparkle.destroy()
    });
  }

  public interact(): void {
    if (this.isCompleted || !this.isActive) return;
    
    // Trigger question scene
    const gameStore = useGameStore.getState();
    gameStore.setCurrentBox(this.boxId);
    
    this.scene.scene.launch('QuestionScene');
    this.scene.scene.pause();
  }

  public markAsCompleted(): void {
    this.isCompleted = true;
    this.isActive = false;
    
    // Change appearance
    this.box.setFillStyle(0x4A4A4A);
    this.box.setStrokeStyle(2, 0x888888);
    
    // Stop animations
    this.scene.tweens.killTweensOf(this);
    
    // Show completion effect
    this.playCompletionEffect();
  }

  private playCompletionEffect(): void {
    // Scale and fade effect
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.2,
      scaleY: 1.2,
      alpha: 0.7,
      duration: 300,
      ease: 'Back.easeOut',
      yoyo: true,
      onComplete: () => {
        this.setScale(1);
        this.setAlpha(0.7);
      }
    });
  }

  public showGlowHint(): void {
    if (this.isCompleted) return;
    
    this.glow.setVisible(true);
    this.glow.setAlpha(0.6);
    
    // Pulsing glow animation
    this.glowTween = this.scene.tweens.add({
      targets: this.glow,
      alpha: { from: 0.6, to: 0.2 },
      scale: { from: 1, to: 1.3 },
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.glow.setVisible(false);
      }
    });
  }

  public hideGlowHint(): void {
    if (this.glowTween) {
      this.glowTween.stop();
    }
    this.glow.setVisible(false);
  }

  public isBoxCompleted(): boolean {
    return this.isCompleted;
  }

  public getBoxId(): string {
    return this.boxId;
  }
}
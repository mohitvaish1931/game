import Phaser from 'phaser';
import { HintType } from '../../types';

export class HintMarker extends Phaser.GameObjects.Container {
  private hintType: HintType;
  private targetPosition: { x: number; y: number };
  private visual: Phaser.GameObjects.GameObject;
  private activeTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number, hintType: HintType, targetPosition: { x: number; y: number }) {
    super(scene, x, y);
    
    this.hintType = hintType;
    this.targetPosition = targetPosition;
    
    this.createVisual();
    scene.add.existing(this);
  }

  private createVisual(): void {
    switch (this.hintType) {
      case 'map':
        this.createMapPing();
        break;
      case 'riddle':
        this.createRiddleText();
        break;
      case 'compass':
        this.createCompassArrow();
        break;
      case 'glow':
        this.createGlowPath();
        break;
    }
  }

  private createMapPing(): void {
    const ping = this.scene.add.circle(0, 0, 20, 0xFF0000, 0.6);
    this.visual = ping;
    this.add(ping);
    
    // Pulsing animation
    this.activeTween = this.scene.tweens.add({
      targets: ping,
      scale: { from: 1, to: 1.5 },
      alpha: { from: 0.6, to: 0.2 },
      duration: 800,
      ease: 'Power2',
      yoyo: true,
      repeat: 3
    });
  }

  private createRiddleText(): void {
    const bg = this.scene.add.rectangle(0, 0, 200, 60, 0x000000, 0.8);
    const text = this.scene.add.text(0, 0, 'Follow the clue!', {
      fontSize: '14px',
      color: '#FFFFFF',
      align: 'center',
      wordWrap: { width: 180 }
    }).setOrigin(0.5);
    
    this.visual = bg;
    this.add([bg, text]);
    
    // Fade in/out animation
    this.setAlpha(0);
    this.activeTween = this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 300,
      yoyo: true,
      repeat: 8,
      repeatDelay: 500
    });
  }

  private createCompassArrow(): void {
    const arrow = this.scene.add.triangle(0, 0, 0, 0, -10, 20, 10, 20, 0x00FF00);
    this.visual = arrow;
    this.add(arrow);
    
    // Point towards target
    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.targetPosition.x, this.targetPosition.y);
    arrow.setRotation(angle + Math.PI / 2);
    
    // Pulsing animation
    this.activeTween = this.scene.tweens.add({
      targets: arrow,
      scale: { from: 1, to: 1.2 },
      duration: 600,
      ease: 'Power2',
      yoyo: true,
      repeat: -1
    });
  }

  private createGlowPath(): void {
    const glow = this.scene.add.circle(0, 0, 15, 0xFFFF00, 0.5);
    this.visual = glow;
    this.add(glow);
    
    // Glowing animation
    this.activeTween = this.scene.tweens.add({
      targets: glow,
      scale: { from: 0.5, to: 1.5 },
      alpha: { from: 0.5, to: 0.1 },
      duration: 1000,
      ease: 'Power2',
      repeat: 3
    });
  }

  public destroy(fromScene?: boolean): void {
    if (this.activeTween) {
      this.activeTween.stop();
    }
    super.destroy(fromScene);
  }

  public getHintType(): HintType {
    return this.hintType;
  }

  public getTargetPosition(): { x: number; y: number } {
    return this.targetPosition;
  }
}
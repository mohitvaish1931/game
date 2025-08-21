import Phaser from 'phaser';

export class Collectible extends Phaser.Physics.Arcade.Sprite {
  private value: number;
  private collectTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number, type: 'coin' | 'gem', value: number = 10) {
    super(scene, x, y, 'collectible');
    
    this.value = value;
    
    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Set up physics
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(16, 16);
    body.setCollideWorldBounds(false);
    body.setGravityY(-200); // Float upward slightly
    
    // Set appearance based on type
    if (type === 'coin') {
      this.setTint(0xFFD700); // Gold
    } else {
      this.setTint(0x00FFFF); // Cyan gem
    }
    
    // Start floating animation
    this.startFloatingAnimation();
    
    // Auto-destroy after 10 seconds
    scene.time.delayedCall(10000, () => {
      if (this.active) {
        this.destroy();
      }
    });
  }

  private startFloatingAnimation(): void {
    this.scene.tweens.add({
      targets: this,
      y: this.y - 10,
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
    
    this.scene.tweens.add({
      targets: this,
      angle: 360,
      duration: 2000,
      repeat: -1
    });
  }

  public collect(): number {
    if (this.collectTween) return 0;
    
    // Play collect animation
    this.collectTween = this.scene.tweens.add({
      targets: this,
      y: this.y - 50,
      alpha: 0,
      scale: 1.5,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        this.destroy();
      }
    });
    
    return this.value;
  }

  public getValue(): number {
    return this.value;
  }
}
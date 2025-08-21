import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/constants';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private keys: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: { [key: string]: Phaser.Input.Keyboard.Key };
  private isGrounded: boolean = false;
  private interactRange: number = 50;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    
    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set up physics
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(24, 32);
    body.setCollideWorldBounds(true);

    // Set up controls
    this.keys = scene.input.keyboard!.createCursorKeys();
    this.wasd = scene.input.keyboard!.addKeys('W,S,A,D') as { [key: string]: Phaser.Input.Keyboard.Key };

    // Set up animations
    this.createAnimations();
    
    // Initial animation
    this.play('idle');
  }

  private createAnimations(): void {
    const scene = this.scene;

    // Create simple animations using color tints and scaling
    if (!scene.anims.exists('idle')) {
      scene.anims.create({
        key: 'idle',
        frames: [{ key: 'player', frame: 0 }],
        frameRate: 1,
        repeat: -1
      });
    }

    if (!scene.anims.exists('run')) {
      scene.anims.create({
        key: 'run',
        frames: [{ key: 'player', frame: 0 }],
        frameRate: 8,
        repeat: -1
      });
    }

    if (!scene.anims.exists('jump')) {
      scene.anims.create({
        key: 'jump',
        frames: [{ key: 'player', frame: 0 }],
        frameRate: 1,
        repeat: 0
      });
    }
  }

  public update(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const speed = GAME_CONFIG.PHYSICS.PLAYER_SPEED;

    // Check if grounded
    this.isGrounded = body.touching.down;

    // Horizontal movement
    if (this.keys.left?.isDown || this.wasd.A?.isDown) {
      body.setVelocityX(-speed);
      this.setFlipX(true);
      if (this.isGrounded && this.anims.currentAnim?.key !== 'run') {
        this.play('run');
      }
    } else if (this.keys.right?.isDown || this.wasd.D?.isDown) {
      body.setVelocityX(speed);
      this.setFlipX(false);
      if (this.isGrounded && this.anims.currentAnim?.key !== 'run') {
        this.play('run');
      }
    } else {
      body.setVelocityX(0);
      if (this.isGrounded && this.anims.currentAnim?.key !== 'idle') {
        this.play('idle');
      }
    }

    // Jumping
    if ((this.keys.up?.isDown || this.wasd.W?.isDown) && this.isGrounded) {
      body.setVelocityY(GAME_CONFIG.PHYSICS.JUMP_VELOCITY);
      this.play('jump');
    }

    // Update animation based on state
    if (!this.isGrounded && this.anims.currentAnim?.key === 'run') {
      this.play('jump');
    }
  }

  public canInteractWith(target: Phaser.GameObjects.GameObject): boolean {
    if (!target.body) return false;
    
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      target.body.center.x, target.body.center.y
    );
    
    return distance <= this.interactRange;
  }

  public getInteractionPrompt(): string {
    return 'Press E to interact';
  }

  public setPosition(x: number, y: number): this {
    super.setPosition(x, y);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    return this;
  }
}
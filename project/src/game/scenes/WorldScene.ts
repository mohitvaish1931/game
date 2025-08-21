import Phaser from 'phaser';
import { Player } from '../objects/Player';
import { TreasureBox } from '../objects/TreasureBox';
import { Collectible } from '../objects/Collectible';
import { HintMarker } from '../objects/HintMarker';
import { getCurrentLevel } from '../config/levels';
import { useGameStore } from '../state/store';
import { GAME_CONFIG } from '../config/constants';
import { SoundManager } from '../utils/sound';
import { hintEngine } from '../utils/hintEngine';
import { questionEngine } from '../utils/questionEngine';

export default class WorldScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private treasureBoxes!: Phaser.Physics.Arcade.Group;
  private collectibles!: Phaser.Physics.Arcade.Group;
  private hintMarkers!: Phaser.GameObjects.Group;
  private background!: Phaser.GameObjects.Image;
  private soundManager!: SoundManager;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private currentLevel: any;
  private nearbyBox: TreasureBox | null = null;
  private interactPrompt?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: GAME_CONFIG.SCENES.WORLD });
  }

  init(): void {
    const gameState = useGameStore.getState();
    this.currentLevel = getCurrentLevel(gameState.levelIndex);
    
    // Initialize sound manager
    this.soundManager = new SoundManager(this);
    
    // Set up hint engine callbacks
    this.setupHintCallbacks();
  }

  create(): void {
    // Create background
    this.background = this.add.image(0, 0, this.currentLevel.background)
      .setOrigin(0, 0)
      .setDisplaySize(GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

    // Create physics groups
    this.platforms = this.physics.add.staticGroup();
    this.treasureBoxes = this.physics.add.group();
    this.collectibles = this.physics.add.group();
    this.hintMarkers = this.add.group();

    // Create level geometry
    this.createPlatforms();
    this.createTreasureBoxes();

    // Create player
    this.player = new Player(this, this.currentLevel.playerSpawn.x, this.currentLevel.playerSpawn.y);

    // Set up physics collisions
    this.setupCollisions();

    // Set up input
    this.setupInput();

    // Start level music
    this.soundManager.playMusic(this.currentLevel.music);

    // Create interaction prompt
    this.interactPrompt = this.add.text(0, 0, '', {
      fontSize: '14px',
      color: '#FFFFFF',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setVisible(false);

    // Subscribe to game state changes
    this.setupGameStateListeners();
  }

  private createPlatforms(): void {
    this.currentLevel.platforms.forEach((platform: any) => {
      // Create platform using tiled sprites for better appearance
      const platformSprite = this.add.tileSprite(
        platform.x, platform.y, platform.width, platform.height, 'platform'
      );
      platformSprite.setOrigin(0, 0);
      
      // Add to physics group
      this.platforms.add(platformSprite);
    });
  }

  private createTreasureBoxes(): void {
    const gameState = useGameStore.getState();
    
    this.currentLevel.treasureBoxes.forEach((boxData: any) => {
      const treasureBox = new TreasureBox(this, boxData.x, boxData.y, boxData.id);
      this.treasureBoxes.add(treasureBox);
    });
  }

  private setupCollisions(): void {
    // Player vs platforms
    this.physics.add.collider(this.player, this.platforms);
    
    // Player vs treasure boxes (for physics collision)
    this.physics.add.collider(this.player, this.treasureBoxes);
    
    // Player vs collectibles (overlap for pickup)
    this.physics.add.overlap(this.player, this.collectibles, this.collectItem, undefined, this);
    
    // Collectibles vs platforms
    this.physics.add.collider(this.collectibles, this.platforms);
  }

  private setupInput(): void {
    // Interaction key
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    
    // Mobile touch controls (will be handled by HUD scene)
    if (this.sys.game.device.input.touch) {
      this.input.addPointer(3); // Support multi-touch
    }
  }

  private setupHintCallbacks(): void {
    hintEngine.registerHintCallback('map', (data) => this.showMapHint(data));
    hintEngine.registerHintCallback('riddle', (data) => this.showRiddleHint(data));
    hintEngine.registerHintCallback('compass', (data) => this.showCompassHint(data));
    hintEngine.registerHintCallback('glow', (data) => this.showGlowHint(data));
  }

  private setupGameStateListeners(): void {
    // Listen for question resolution
    this.scene.get('QuestionScene')?.events.on('questionResolved', (result: any) => {
      this.handleQuestionResult(result);
    });
  }

  update(): void {
    // Update player
    this.player.update();
    
    // Check for nearby treasure boxes
    this.checkForNearbyBoxes();
    
    // Handle interaction input
    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.handleInteraction();
    }
    
    // Update interaction prompt position
    if (this.interactPrompt && this.nearbyBox) {
      this.interactPrompt.setPosition(
        this.nearbyBox.x - this.interactPrompt.width / 2,
        this.nearbyBox.y - 50
      );
    }
  }

  private checkForNearbyBoxes(): void {
    let closestBox: TreasureBox | null = null;
    let closestDistance = Infinity;
    
    this.treasureBoxes.children.entries.forEach(box => {
      const treasureBox = box as TreasureBox;
      if (treasureBox.isBoxCompleted()) return;
      
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        treasureBox.x, treasureBox.y
      );
      
      if (distance < 60 && distance < closestDistance) {
        closestBox = treasureBox;
        closestDistance = distance;
      }
    });
    
    // Update nearby box
    if (closestBox !== this.nearbyBox) {
      this.nearbyBox = closestBox;
      this.updateInteractionPrompt();
    }
  }

  private updateInteractionPrompt(): void {
    if (this.nearbyBox) {
      this.interactPrompt?.setText(this.player.getInteractionPrompt()).setVisible(true);
    } else {
      this.interactPrompt?.setVisible(false);
    }
  }

  private handleInteraction(): void {
    if (this.nearbyBox && !this.nearbyBox.isBoxCompleted()) {
      this.nearbyBox.interact();
      this.soundManager.playSfx('box-open-sound');
    }
  }

  private handleQuestionResult(result: { 
    correct: boolean; 
    question: any; 
    boxId: string; 
    coinsEarned?: number;
    hintData?: any;
  }): void {
    const gameState = useGameStore.getState();
    
    if (result.correct) {
      // Mark box as completed
      gameState.markBoxCompleted(result.boxId);
      gameState.incrementCorrect();
      gameState.incrementScore(10);
      
      // Find and complete the box visually
      const box = this.treasureBoxes.children.entries.find(b => 
        (b as TreasureBox).getBoxId() === result.boxId
      ) as TreasureBox;
      
      if (box) {
        box.markAsCompleted();
      }
      
      // Spawn collectibles if in reward mode
      if (gameState.mode === 'reward' && result.coinsEarned) {
        this.spawnCollectibles(box.x, box.y, result.coinsEarned);
      }
      
      // Show hint for next box
      if (result.hintData && result.question.nextClue) {
        this.processHint(result.question, box);
      }
      
      // Check level completion
      if (gameState.correctThisLevel >= this.currentLevel.requiredAnswers) {
        this.completeLevel();
      }
    }
    
    // Resume world scene
    this.scene.resume();
    this.nearbyBox = null;
    this.updateInteractionPrompt();
  }

  private spawnCollectibles(x: number, y: number, value: number): void {
    const numCoins = Math.min(5, Math.ceil(value / 10));
    
    for (let i = 0; i < numCoins; i++) {
      const angle = (i / numCoins) * Math.PI * 2;
      const distance = 30 + Math.random() * 20;
      
      const coinX = x + Math.cos(angle) * distance;
      const coinY = y + Math.sin(angle) * distance;
      
      const coin = new Collectible(this, coinX, coinY, 'coin', 10);
      this.collectibles.add(coin);
    }
  }

  private processHint(question: any, sourceBox: TreasureBox): void {
    // Find next uncompleted box
    const gameState = useGameStore.getState();
    const nextBox = this.treasureBoxes.children.entries.find(b => {
      const box = b as TreasureBox;
      return !box.isBoxCompleted() && box.getBoxId() !== sourceBox.getBoxId();
    }) as TreasureBox;
    
    if (nextBox && question.hintType) {
      // Delay hint to allow for box completion animation
      this.time.delayedCall(1000, () => {
        hintEngine.processHintFromQuestion(
          question.hintType,
          { x: nextBox.x, y: nextBox.y },
          question.nextClue
        );
      });
    }
  }

  private collectItem(player: Player, collectible: Collectible): void {
    const value = collectible.collect();
    if (value > 0) {
      const gameState = useGameStore.getState();
      gameState.addCoins(value);
      this.soundManager.playSfx('collect-sound');
      
      // Show floating text
      const floatText = this.add.text(collectible.x, collectible.y, `+${value}`, {
        fontSize: '16px',
        color: '#FFD700',
        fontStyle: 'bold'
      });
      
      this.tweens.add({
        targets: floatText,
        y: floatText.y - 30,
        alpha: 0,
        duration: 800,
        onComplete: () => floatText.destroy()
      });
    }
  }

  private completeLevel(): void {
    this.soundManager.stopMusic();
    this.soundManager.playSfx('correct-sound');
    
    // Show level completion effect
    const overlay = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2, GAME_CONFIG.HEIGHT / 2,
      GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT,
      0x000000, 0.5
    );
    
    const completionText = this.add.text(
      GAME_CONFIG.WIDTH / 2, GAME_CONFIG.HEIGHT / 2,
      'Level Complete!',
      {
        fontSize: '48px',
        color: '#FFFFFF',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);
    
    this.tweens.add({
      targets: [overlay, completionText],
      alpha: { from: 0, to: 1 },
      duration: 1000,
      onComplete: () => {
        this.time.delayedCall(2000, () => {
          this.scene.start(GAME_CONFIG.SCENES.RESULT);
        });
      }
    });
  }

  // Hint display methods
  private showMapHint(data: any): void {
    const marker = new HintMarker(this, data.targetPosition.x, data.targetPosition.y - 30, 'map', data.targetPosition);
    this.hintMarkers.add(marker);
    
    this.time.delayedCall(data.duration || 3000, () => {
      marker.destroy();
    });
  }

  private showRiddleHint(data: any): void {
    const centerX = GAME_CONFIG.WIDTH / 2;
    const centerY = 100;
    
    const bg = this.add.rectangle(centerX, centerY, 400, 80, 0x000000, 0.8);
    const text = this.add.text(centerX, centerY, data.message || 'Follow the clue!', {
      fontSize: '16px',
      color: '#FFFFFF',
      align: 'center',
      wordWrap: { width: 380 }
    }).setOrigin(0.5);
    
    const group = this.add.group([bg, text]);
    
    this.time.delayedCall(data.duration || 5000, () => {
      group.destroy(true);
    });
  }

  private showCompassHint(data: any): void {
    const marker = new HintMarker(this, this.player.x, this.player.y - 40, 'compass', data.targetPosition);
    this.hintMarkers.add(marker);
    
    // Update compass direction periodically
    const updateCompass = () => {
      if (marker.active) {
        const angle = Phaser.Math.Angle.Between(
          this.player.x, this.player.y,
          data.targetPosition.x, data.targetPosition.y
        );
        marker.setRotation(angle);
        marker.setPosition(this.player.x, this.player.y - 40);
      }
    };
    
    const compassTimer = this.time.addEvent({
      delay: 100,
      callback: updateCompass,
      loop: true
    });
    
    this.time.delayedCall(data.duration || 8000, () => {
      compassTimer.destroy();
      marker.destroy();
    });
  }

  private showGlowHint(data: any): void {
    // Find nearest box to target
    const targetBox = this.treasureBoxes.children.entries.find(b => {
      const box = b as TreasureBox;
      const distance = Phaser.Math.Distance.Between(
        box.x, box.y, data.targetPosition.x, data.targetPosition.y
      );
      return distance < 50;
    }) as TreasureBox;
    
    if (targetBox) {
      targetBox.showGlowHint();
      
      this.time.delayedCall(data.duration || 4000, () => {
        targetBox.hideGlowHint();
      });
    }
  }
}
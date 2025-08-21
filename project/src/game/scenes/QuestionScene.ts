import Phaser from 'phaser';
import { useGameStore } from '../state/store';
import { questionEngine } from '../utils/questionEngine';
import { pickNextQuestion, getQuestionById } from '../config/questions';
import { GAME_CONFIG } from '../config/constants';
import { SoundManager } from '../utils/sound';

export default class QuestionScene extends Phaser.Scene {
  private questionContainer?: Phaser.GameObjects.Container;
  private questionText?: Phaser.GameObjects.Text;
  private optionButtons: Phaser.GameObjects.Container[] = [];
  private attemptsText?: Phaser.GameObjects.Text;
  private soundManager?: SoundManager;
  private currentQuestion: any;
  private currentBoxId: string = '';
  private isAnswered: boolean = false;

  constructor() {
    super({ key: GAME_CONFIG.SCENES.QUESTION });
  }

  init(): void {
    this.soundManager = new SoundManager(this);
    this.isAnswered = false;
  }

  create(): void {
    // Get current game state
    const gameState = useGameStore.getState();
    this.currentBoxId = gameState.currentBoxId || '';
    
    // Pick a question for current subject
    const question = pickNextQuestion(gameState.subject, gameState.completedBoxIds);
    if (!question) {
      console.error('No questions available');
      this.scene.stop();
      return;
    }
    
    this.currentQuestion = question;
    gameState.setCurrentQuestion(question.id);
    
    // Create modal background
    const overlay = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2, GAME_CONFIG.HEIGHT / 2,
      GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT,
      0x000000, 0.7
    );
    overlay.setInteractive();
    
    // Create question container
    this.createQuestionModal();
    
    // Set up input
    this.input.keyboard?.on('keydown-ESC', this.closeModal, this);
  }

  private createQuestionModal(): void {
    const centerX = GAME_CONFIG.WIDTH / 2;
    const centerY = GAME_CONFIG.HEIGHT / 2;
    
    // Main container
    this.questionContainer = this.add.container(centerX, centerY);
    
    // Modal background
    const modalBg = this.add.rectangle(0, 0, 500, 400, 0xFFFFFF);
    modalBg.setStrokeStyle(4, 0x3B82F6);
    
    // Subject indicator
    const gameState = useGameStore.getState();
    const subjectTag = this.add.rectangle(-200, -170, 100, 30, 0x3B82F6);
    const subjectText = this.add.text(-200, -170, gameState.subject, {
      fontSize: '14px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Question text
    this.questionText = this.add.text(0, -120, this.currentQuestion.prompt, {
      fontSize: '18px',
      color: '#333333',
      align: 'center',
      wordWrap: { width: 450 }
    }).setOrigin(0.5);
    
    // Answer options
    this.createAnswerOptions();
    
    // Attempts counter
    this.attemptsText = this.add.text(150, -170, `Attempts: ${gameState.attempts}/3`, {
      fontSize: '14px',
      color: '#E74C3C',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Close button
    const closeButton = this.createCloseButton();
    
    // Add all to container
    this.questionContainer.add([
      modalBg, subjectTag, subjectText, this.questionText, 
      this.attemptsText, closeButton, ...this.optionButtons
    ]);
    
    // Animate in
    this.questionContainer.setScale(0.8).setAlpha(0);
    this.tweens.add({
      targets: this.questionContainer,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: 'Back.easeOut'
    });
  }

  private createAnswerOptions(): void {
    this.optionButtons = [];
    const optionColors = [0x3B82F6, 0x10B981, 0xF59E0B, 0xEF4444];
    
    this.currentQuestion.options.forEach((option: string, index: number) => {
      const y = -20 + index * 60;
      const container = this.add.container(0, y);
      
      // Option background
      const bg = this.add.rectangle(0, 0, 400, 45, optionColors[index], 0.9);
      bg.setInteractive();
      
      // Option text
      const text = this.add.text(0, 0, `${String.fromCharCode(65 + index)}. ${option}`, {
        fontSize: '16px',
        color: '#FFFFFF',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      container.add([bg, text]);
      
      // Hover effects
      bg.on('pointerover', () => {
        if (!this.isAnswered) {
          bg.setAlpha(1);
          container.setScale(1.05);
        }
      });
      
      bg.on('pointerout', () => {
        if (!this.isAnswered) {
          bg.setAlpha(0.9);
          container.setScale(1);
        }
      });
      
      // Click handler
      bg.on('pointerdown', () => {
        if (!this.isAnswered) {
          this.selectAnswer(index);
        }
      });
      
      this.optionButtons.push(container);
    });
  }

  private createCloseButton(): Phaser.GameObjects.Container {
    const closeButton = this.add.container(220, -180);
    
    const closeBg = this.add.circle(0, 0, 15, 0xDC2626);
    const closeText = this.add.text(0, 0, '×', {
      fontSize: '20px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    closeButton.add([closeBg, closeText]);
    closeButton.setInteractive(new Phaser.Geom.Circle(0, 0, 15), Phaser.Geom.Circle.Contains);
    
    closeButton.on('pointerdown', () => {
      this.closeModal();
    });
    
    closeButton.on('pointerover', () => {
      closeBg.setFillStyle(0xEF4444);
    });
    
    closeButton.on('pointerout', () => {
      closeBg.setFillStyle(0xDC2626);
    });
    
    return closeButton;
  }

  private selectAnswer(selectedIndex: number): void {
    if (this.isAnswered) return;
    
    this.isAnswered = true;
    const gameState = useGameStore.getState();
    
    // Submit answer to question engine
    const result = questionEngine.submitAnswer(selectedIndex);
    
    if (result.correct) {
      // Correct answer
      this.showCorrectAnswer(selectedIndex);
      this.soundManager?.playSfx('correct-sound');
      
      // Update game state
      const coinsEarned = gameState.mode === 'reward' ? GAME_CONFIG.UI.COINS_PER_CORRECT : 0;
      
      // Close modal after delay and return to world
      this.time.delayedCall(1500, () => {
        this.returnToWorld({
          correct: true,
          question: this.currentQuestion,
          boxId: this.currentBoxId,
          coinsEarned,
          hintData: { 
            type: this.currentQuestion.hintType,
            message: this.currentQuestion.nextClue 
          }
        });
      });
      
    } else {
      // Wrong answer
      this.showWrongAnswer(selectedIndex);
      this.soundManager?.playSfx('wrong-sound');
      gameState.decrementAttempts();
      
      if (result.attempts > 0) {
        // Still have attempts left
        this.attemptsText?.setText(`Attempts: ${result.attempts}/3`);
        
        this.time.delayedCall(1000, () => {
          this.isAnswered = false;
          this.resetAnswerButtons();
        });
        
      } else {
        // No attempts left, show solution
        this.showSolution();
        this.time.delayedCall(3000, () => {
          this.returnToWorld({
            correct: false,
            question: this.currentQuestion,
            boxId: this.currentBoxId,
            showedSolution: true
          });
        });
      }
    }
  }

  private showCorrectAnswer(correctIndex: number): void {
    // Highlight correct answer in green
    const correctButton = this.optionButtons[correctIndex];
    const bg = correctButton.list[0] as Phaser.GameObjects.Rectangle;
    bg.setFillStyle(0x10B981);
    
    // Add checkmark
    const checkmark = this.add.text(correctButton.x + 150, correctButton.y, '✓', {
      fontSize: '24px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.questionContainer?.add(checkmark);
    
    // Celebration effect
    this.tweens.add({
      targets: correctButton,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 200,
      yoyo: true,
      repeat: 1
    });
  }

  private showWrongAnswer(wrongIndex: number): void {
    // Highlight wrong answer in red
    const wrongButton = this.optionButtons[wrongIndex];
    const bg = wrongButton.list[0] as Phaser.GameObjects.Rectangle;
    bg.setFillStyle(0xEF4444);
    
    // Add X mark
    const xmark = this.add.text(wrongButton.x + 150, wrongButton.y, '✗', {
      fontSize: '24px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.questionContainer?.add(xmark);
    
    // Shake effect
    this.tweens.add({
      targets: wrongButton,
      x: wrongButton.x + 10,
      duration: 100,
      yoyo: true,
      repeat: 3
    });
  }

  private showSolution(): void {
    // Highlight correct answer
    const correctIndex = this.currentQuestion.answerIndex;
    const correctButton = this.optionButtons[correctIndex];
    const bg = correctButton.list[0] as Phaser.GameObjects.Rectangle;
    bg.setFillStyle(0x10B981);
    
    // Show solution text
    const solutionText = this.add.text(0, 140, this.currentQuestion.solution, {
      fontSize: '14px',
      color: '#333333',
      align: 'center',
      wordWrap: { width: 450 },
      backgroundColor: '#F0F9FF',
      padding: { x: 10, y: 10 }
    }).setOrigin(0.5);
    
    this.questionContainer?.add(solutionText);
  }

  private resetAnswerButtons(): void {
    const optionColors = [0x3B82F6, 0x10B981, 0xF59E0B, 0xEF4444];
    
    this.optionButtons.forEach((button, index) => {
      const bg = button.list[0] as Phaser.GameObjects.Rectangle;
      bg.setFillStyle(optionColors[index], 0.9);
      button.setScale(1);
      button.setPosition(0, -20 + index * 60);
    });
    
    // Remove any additional marks
    if (this.questionContainer) {
      this.questionContainer.list.forEach(child => {
        const obj = child as any;
        if (obj.text === '✓' || obj.text === '✗') {
          obj.destroy();
        }
      });
    }
  }

  private closeModal(): void {
    this.returnToWorld({ correct: false, question: this.currentQuestion, boxId: this.currentBoxId });
  }

  private returnToWorld(result: any): void {
    // Animate out
    if (this.questionContainer) {
      this.tweens.add({
        targets: this.questionContainer,
        scale: 0.8,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          // Clear current question
          const gameState = useGameStore.getState();
          gameState.clearCurrentQuestion();
          
          // Emit result to world scene
          this.events.emit('questionResolved', result);
          
          // Stop this scene
          this.scene.stop();
        }
      });
    }
  }
}
import { HintType } from '../../types';
import { useGameStore } from '../state/store';

export interface HintData {
  type: HintType;
  targetPosition: { x: number; y: number };
  message?: string;
  duration?: number;
}

export class HintEngine {
  private activeHints: Map<string, HintData> = new Map();
  private hintCallbacks: Map<HintType, (data: HintData) => void> = new Map();

  public registerHintCallback(type: HintType, callback: (data: HintData) => void): void {
    this.hintCallbacks.set(type, callback);
  }

  public emitHint(type: HintType, targetPosition: { x: number; y: number }, message?: string, duration: number = 3000): void {
    const hintData: HintData = {
      type,
      targetPosition,
      message,
      duration
    };

    // Store the hint
    const hintId = `${type}_${Date.now()}`;
    this.activeHints.set(hintId, hintData);

    // Execute the hint callback if registered
    const callback = this.hintCallbacks.get(type);
    if (callback) {
      callback(hintData);
    }

    // Auto-remove hint after duration
    setTimeout(() => {
      this.activeHints.delete(hintId);
    }, duration);

    // Track hint usage
    useGameStore.getState().incrementHintsUsed();
  }

  public getActiveHints(): HintData[] {
    return Array.from(this.activeHints.values());
  }

  public clearAllHints(): void {
    this.activeHints.clear();
  }

  public showMapHint(targetPosition: { x: number; y: number }): void {
    this.emitHint('map', targetPosition, 'Check your map for the treasure location!', 3000);
  }

  public showRiddleHint(targetPosition: { x: number; y: number }, riddle: string): void {
    this.emitHint('riddle', targetPosition, riddle, 5000);
  }

  public showCompassHint(targetPosition: { x: number; y: number }): void {
    this.emitHint('compass', targetPosition, 'Follow the compass to find your treasure!', 8000);
  }

  public showGlowHint(targetPosition: { x: number; y: number }): void {
    this.emitHint('glow', targetPosition, 'Follow the glowing path!', 4000);
  }

  public processHintFromQuestion(hintType?: HintType, targetPosition?: { x: number; y: number }, message?: string): void {
    if (!hintType || !targetPosition) return;

    switch (hintType) {
      case 'map':
        this.showMapHint(targetPosition);
        break;
      case 'riddle':
        this.showRiddleHint(targetPosition, message || 'Follow the clue to find your treasure!');
        break;
      case 'compass':
        this.showCompassHint(targetPosition);
        break;
      case 'glow':
        this.showGlowHint(targetPosition);
        break;
    }
  }
}

// Singleton instance
export const hintEngine = new HintEngine();
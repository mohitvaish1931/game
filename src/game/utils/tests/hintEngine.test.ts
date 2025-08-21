import { describe, it, expect, beforeEach, vi } from 'vitest';
import { hintEngine, HintData } from '../hintEngine';
import { HintType } from '../../../types';

describe('HintEngine', () => {
  beforeEach(() => {
    hintEngine.clearAllHints();
    vi.clearAllMocks();
  });

  describe('registerHintCallback', () => {
    it('should register callback for hint type', () => {
      const mockCallback = vi.fn();
      hintEngine.registerHintCallback('map', mockCallback);
      
      hintEngine.emitHint('map', { x: 100, y: 200 });
      
      expect(mockCallback).toHaveBeenCalledWith({
        type: 'map',
        targetPosition: { x: 100, y: 200 },
        duration: 3000
      });
    });
  });

  describe('emitHint', () => {
    it('should emit hint with correct data', () => {
      const mockCallback = vi.fn();
      hintEngine.registerHintCallback('riddle', mockCallback);
      
      hintEngine.emitHint('riddle', { x: 50, y: 75 }, 'Test riddle', 5000);
      
      expect(mockCallback).toHaveBeenCalledWith({
        type: 'riddle',
        targetPosition: { x: 50, y: 75 },
        message: 'Test riddle',
        duration: 5000
      });
    });

    it('should store active hint', () => {
      hintEngine.emitHint('compass', { x: 200, y: 300 });
      
      const activeHints = hintEngine.getActiveHints();
      expect(activeHints).toHaveLength(1);
      expect(activeHints[0].type).toBe('compass');
      expect(activeHints[0].targetPosition).toEqual({ x: 200, y: 300 });
    });
  });

  describe('showMapHint', () => {
    it('should emit map hint with correct parameters', () => {
      const mockCallback = vi.fn();
      hintEngine.registerHintCallback('map', mockCallback);
      
      hintEngine.showMapHint({ x: 150, y: 250 });
      
      expect(mockCallback).toHaveBeenCalledWith({
        type: 'map',
        targetPosition: { x: 150, y: 250 },
        message: 'Check your map for the treasure location!',
        duration: 3000
      });
    });
  });

  describe('showRiddleHint', () => {
    it('should emit riddle hint with custom message', () => {
      const mockCallback = vi.fn();
      hintEngine.registerHintCallback('riddle', mockCallback);
      
      const customRiddle = 'Where shadows dance and light fades away';
      hintEngine.showRiddleHint({ x: 100, y: 100 }, customRiddle);
      
      expect(mockCallback).toHaveBeenCalledWith({
        type: 'riddle',
        targetPosition: { x: 100, y: 100 },
        message: customRiddle,
        duration: 5000
      });
    });
  });

  describe('showCompassHint', () => {
    it('should emit compass hint with correct duration', () => {
      const mockCallback = vi.fn();
      hintEngine.registerHintCallback('compass', mockCallback);
      
      hintEngine.showCompassHint({ x: 300, y: 400 });
      
      expect(mockCallback).toHaveBeenCalledWith({
        type: 'compass',
        targetPosition: { x: 300, y: 400 },
        message: 'Follow the compass to find your treasure!',
        duration: 8000
      });
    });
  });

  describe('showGlowHint', () => {
    it('should emit glow hint with correct parameters', () => {
      const mockCallback = vi.fn();
      hintEngine.registerHintCallback('glow', mockCallback);
      
      hintEngine.showGlowHint({ x: 500, y: 600 });
      
      expect(mockCallback).toHaveBeenCalledWith({
        type: 'glow',
        targetPosition: { x: 500, y: 600 },
        message: 'Follow the glowing path!',
        duration: 4000
      });
    });
  });

  describe('processHintFromQuestion', () => {
    it('should process map hint correctly', () => {
      const mockCallback = vi.fn();
      hintEngine.registerHintCallback('map', mockCallback);
      
      hintEngine.processHintFromQuestion('map', { x: 100, y: 200 }, 'Custom clue');
      
      expect(mockCallback).toHaveBeenCalled();
    });

    it('should handle undefined parameters gracefully', () => {
      expect(() => {
        hintEngine.processHintFromQuestion(undefined, { x: 100, y: 200 });
      }).not.toThrow();
      
      expect(() => {
        hintEngine.processHintFromQuestion('map', undefined);
      }).not.toThrow();
    });
  });

  describe('clearAllHints', () => {
    it('should clear all active hints', () => {
      hintEngine.emitHint('map', { x: 100, y: 200 });
      hintEngine.emitHint('riddle', { x: 300, y: 400 });
      
      expect(hintEngine.getActiveHints()).toHaveLength(2);
      
      hintEngine.clearAllHints();
      
      expect(hintEngine.getActiveHints()).toHaveLength(0);
    });
  });
});
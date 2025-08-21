import { describe, it, expect, beforeEach } from 'vitest';
import { questionEngine } from '../questionEngine';
import { Question } from '../../../types';

const mockQuestion: Question = {
  id: 'test_1',
  subject: 'Math',
  difficulty: 'easy',
  prompt: 'What is 2 + 2?',
  options: ['3', '4', '5', '6'],
  answerIndex: 1,
  solution: '2 + 2 = 4',
  hintType: 'map',
  nextClue: 'Look for the next treasure'
};

describe('QuestionEngine', () => {
  beforeEach(() => {
    questionEngine.clearCurrentQuestion();
  });

  describe('setCurrentQuestion', () => {
    it('should set current question and reset attempts', () => {
      const result = questionEngine.setCurrentQuestion(mockQuestion.id);
      expect(result).toBeTruthy();
      expect(questionEngine.getCurrentQuestion()?.id).toBe(mockQuestion.id);
      expect(questionEngine.getRemainingAttempts()).toBe(3);
    });

    it('should return null for invalid question id', () => {
      const result = questionEngine.setCurrentQuestion('invalid_id');
      expect(result).toBeNull();
    });
  });

  describe('submitAnswer', () => {
    beforeEach(() => {
      questionEngine.setCurrentQuestion(mockQuestion.id);
    });

    it('should return correct result for right answer', () => {
      const result = questionEngine.submitAnswer(1); // Correct answer
      expect(result.correct).toBe(true);
      expect(result.attempts).toBe(3);
      expect(result.shouldShowSolution).toBe(false);
    });

    it('should decrement attempts for wrong answer', () => {
      const result = questionEngine.submitAnswer(0); // Wrong answer
      expect(result.correct).toBe(false);
      expect(result.attempts).toBe(2);
      expect(result.shouldShowSolution).toBe(false);
    });

    it('should show solution after 3 wrong attempts', () => {
      // First wrong attempt
      questionEngine.submitAnswer(0);
      expect(questionEngine.getRemainingAttempts()).toBe(2);

      // Second wrong attempt
      questionEngine.submitAnswer(0);
      expect(questionEngine.getRemainingAttempts()).toBe(1);

      // Third wrong attempt
      const result = questionEngine.submitAnswer(0);
      expect(result.correct).toBe(false);
      expect(result.attempts).toBe(0);
      expect(result.shouldShowSolution).toBe(true);
      expect(result.solution).toBe(mockQuestion.solution);
    });
  });

  describe('resetAttempts', () => {
    it('should reset attempts to 3', () => {
      questionEngine.setCurrentQuestion(mockQuestion.id);
      questionEngine.submitAnswer(0); // Wrong answer
      expect(questionEngine.getRemainingAttempts()).toBe(2);
      
      questionEngine.resetAttempts();
      expect(questionEngine.getRemainingAttempts()).toBe(3);
    });
  });

  describe('clearCurrentQuestion', () => {
    it('should clear current question and reset attempts', () => {
      questionEngine.setCurrentQuestion(mockQuestion.id);
      expect(questionEngine.getCurrentQuestion()).toBeTruthy();
      
      questionEngine.clearCurrentQuestion();
      expect(questionEngine.getCurrentQuestion()).toBeNull();
      expect(questionEngine.getRemainingAttempts()).toBe(3);
    });
  });

  describe('getHintForCurrentQuestion', () => {
    it('should return hint for current question', () => {
      questionEngine.setCurrentQuestion(mockQuestion.id);
      const hint = questionEngine.getHintForCurrentQuestion();
      expect(hint).toBe(mockQuestion.nextClue);
    });

    it('should return null when no current question', () => {
      const hint = questionEngine.getHintForCurrentQuestion();
      expect(hint).toBeNull();
    });
  });
});
import { Question, Subject } from '../../types';
import { pickNextQuestion, getQuestionById } from '../config/questions';
import { useGameStore } from '../state/store';

export class QuestionEngine {
  private currentQuestion: Question | null = null;
  private attempts: number = 3;

  public getNextQuestion(subject: Subject, completedIds: string[]): Question | null {
    return pickNextQuestion(subject, completedIds);
  }

  public setCurrentQuestion(questionId: string): Question | null {
    const question = getQuestionById(questionId);
    if (question) {
      this.currentQuestion = question;
      this.attempts = 3;
      return question;
    }
    return null;
  }

  public submitAnswer(answerIndex: number): {
    correct: boolean;
    attempts: number;
    solution?: string;
    shouldShowSolution: boolean;
  } {
    if (!this.currentQuestion) {
      return { correct: false, attempts: this.attempts, shouldShowSolution: false };
    }

    const correct = answerIndex === this.currentQuestion.answerIndex;
    
    if (!correct) {
      this.attempts--;
    }

    const shouldShowSolution = !correct && this.attempts === 0;

    return {
      correct,
      attempts: this.attempts,
      solution: shouldShowSolution ? this.currentQuestion.solution : undefined,
      shouldShowSolution
    };
  }

  public getCurrentQuestion(): Question | null {
    return this.currentQuestion;
  }

  public getRemainingAttempts(): number {
    return this.attempts;
  }

  public resetAttempts(): void {
    this.attempts = 3;
  }

  public clearCurrentQuestion(): void {
    this.currentQuestion = null;
    this.attempts = 3;
  }

  public getHintForCurrentQuestion(): string | null {
    if (!this.currentQuestion) return null;
    return this.currentQuestion.nextClue || null;
  }

  public getQuestionStats(subject: Subject, completedIds: string[]): {
    total: number;
    completed: number;
    remaining: number;
  } {
    const totalQuestions = pickNextQuestion(subject, []);
    const total = totalQuestions ? 15 : 0; // We have 15 questions total
    const completed = completedIds.length;
    const remaining = Math.max(0, total - completed);

    return { total, completed, remaining };
  }
}

// Singleton instance
export const questionEngine = new QuestionEngine();
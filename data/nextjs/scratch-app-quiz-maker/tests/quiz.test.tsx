import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

beforeEach(() => { cleanup(); });

describe('Home page', () => {
  it('shows quiz and question counts', () => {
    render(<App />);
    expect(screen.getByTestId('quiz-count').textContent).toBe('2');
    expect(screen.getByTestId('question-count').textContent).toBe('3');
  });
});

describe('Quizzes page', () => {
  it('shows seed quizzes', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-quizzes'));
    expect(screen.getByTestId('quiz-row-q1')).toBeTruthy();
    expect(screen.getByTestId('quiz-row-q2')).toBeTruthy();
  });

  it('adds a new quiz', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-quizzes'));
    fireEvent.change(screen.getByTestId('quiz-title'), { target: { value: 'History' } });
    fireEvent.click(screen.getByTestId('add-quiz-btn'));
    expect(screen.getByText(/History/)).toBeTruthy();
  });

  it('rejects empty title', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-quizzes'));
    fireEvent.click(screen.getByTestId('add-quiz-btn'));
    expect(screen.getByTestId('quiz-error')).toBeTruthy();
  });

  it('deletes a quiz', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-quizzes'));
    fireEvent.click(screen.getByTestId('delete-quiz-q2'));
    expect(screen.queryByTestId('quiz-row-q2')).toBeNull();
  });
});

describe('Create page', () => {
  it('shows questions for selected quiz', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-create'));
    expect(screen.getByTestId('question-row-qu1')).toBeTruthy();
  });

  it('adds a question', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-create'));
    fireEvent.change(screen.getByTestId('question-text'), { target: { value: 'New question?' } });
    fireEvent.change(screen.getByTestId('option-a'), { target: { value: 'A' } });
    fireEvent.change(screen.getByTestId('option-b'), { target: { value: 'B' } });
    fireEvent.change(screen.getByTestId('option-c'), { target: { value: 'C' } });
    fireEvent.change(screen.getByTestId('option-d'), { target: { value: 'D' } });
    fireEvent.click(screen.getByTestId('add-question-btn'));
    expect(screen.getByText(/New question/)).toBeTruthy();
  });

  it('rejects empty question', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-create'));
    fireEvent.click(screen.getByTestId('add-question-btn'));
    expect(screen.getByTestId('question-error')).toBeTruthy();
  });
});

describe('Quiz taking', () => {
  it('shows answer options when quiz started', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-quizzes'));
    fireEvent.click(screen.getByTestId('start-quiz-q1'));
    expect(screen.getByTestId('answer-option-0')).toBeTruthy();
    expect(screen.getByTestId('answer-option-1')).toBeTruthy();
  });

  it('navigates to results after submit', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-quizzes'));
    fireEvent.click(screen.getByTestId('start-quiz-q1'));
    // Answer Q1
    fireEvent.click(screen.getByTestId('answer-option-1'));
    fireEvent.click(screen.getByTestId('next-question-btn'));
    // Answer Q2
    fireEvent.click(screen.getByTestId('answer-option-2'));
    fireEvent.click(screen.getByTestId('submit-quiz-btn'));
    expect(screen.getByTestId('result-score')).toBeTruthy();
  });
});

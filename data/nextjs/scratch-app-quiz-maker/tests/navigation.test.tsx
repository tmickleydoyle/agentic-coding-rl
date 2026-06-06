import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

beforeEach(() => { cleanup(); });

describe('Navigation', () => {
  it('renders home by default', () => {
    render(<App />);
    expect(screen.getByTestId('quiz-count')).toBeTruthy();
  });

  it('nav-quizzes shows quiz list', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-quizzes'));
    expect(screen.getByTestId('add-quiz-btn')).toBeTruthy();
  });

  it('nav-create shows create page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-create'));
    expect(screen.getByTestId('add-question-btn')).toBeTruthy();
  });

  it('nav-results shows results page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-results'));
    expect(screen.getByTestId('no-results')).toBeTruthy();
  });

  it('nav-home returns home', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-quizzes'));
    fireEvent.click(screen.getByTestId('nav-home'));
    expect(screen.getByTestId('quiz-count')).toBeTruthy();
  });
});

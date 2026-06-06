import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Navigation', () => {
  it('shows navbar', () => {
    render(<App />);
    expect(screen.getByTestId('navbar')).toBeTruthy();
  });
  it('shows home by default', () => {
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });
  it('navigates to library', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-library'));
    expect(screen.getByTestId('library-page')).toBeTruthy();
  });
  it('navigates to quiz', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-quiz'));
    expect(screen.getByTestId('quiz-page')).toBeTruthy();
  });
  it('navigates to results', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-results'));
    expect(screen.getByTestId('results-page')).toBeTruthy();
  });
});

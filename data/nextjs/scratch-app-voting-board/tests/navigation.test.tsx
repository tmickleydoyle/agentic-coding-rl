import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Voting Board Navigation', () => {
  it('shows home page by default', () => {
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });

  it('has all nav links', () => {
    render(<App />);
    expect(screen.getByTestId('nav-proposals')).toBeTruthy();
    expect(screen.getByTestId('nav-submit')).toBeTruthy();
    expect(screen.getByTestId('nav-leaderboard')).toBeTruthy();
  });

  it('navigates to proposals page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-proposals'));
    expect(screen.getByTestId('proposals-page')).toBeTruthy();
  });

  it('navigates to submit page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-submit'));
    expect(screen.getByTestId('submit-page')).toBeTruthy();
  });

  it('navigates to leaderboard page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-leaderboard'));
    expect(screen.getByTestId('leaderboard-page')).toBeTruthy();
  });
});

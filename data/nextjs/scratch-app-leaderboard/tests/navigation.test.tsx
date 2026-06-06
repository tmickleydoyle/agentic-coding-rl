import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Leaderboard Navigation', () => {
  it('shows home page by default', () => {
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });

  it('has nav links', () => {
    render(<App />);
    expect(screen.getByTestId('nav-rankings')).toBeTruthy();
    expect(screen.getByTestId('nav-submit')).toBeTruthy();
  });

  it('navigates to rankings page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-rankings'));
    expect(screen.getByTestId('rankings-page')).toBeTruthy();
  });

  it('navigates to submit page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-submit'));
    expect(screen.getByTestId('submit-page')).toBeTruthy();
  });

  it('navigates back to home', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-rankings'));
    fireEvent.click(screen.getByTestId('nav-home'));
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Navigation', () => {
  it('shows navbar', () => { render(<App />); expect(screen.getByTestId('navbar')).toBeTruthy(); });
  it('home by default', () => { render(<App />); expect(screen.getByTestId('home-page')).toBeTruthy(); });
  it('navigates to watchlist', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-watchlist'));
    expect(screen.getByTestId('watchlist-page')).toBeTruthy();
  });
  it('navigates to alerts', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-alerts'));
    expect(screen.getByTestId('alerts-page')).toBeTruthy();
  });
  it('navigates to history', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-history'));
    expect(screen.getByTestId('history-page')).toBeTruthy();
  });
});

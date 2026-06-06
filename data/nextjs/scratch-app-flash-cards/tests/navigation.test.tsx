import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Navigation', () => {
  it('renders navbar', () => {
    render(<App />);
    expect(screen.getByTestId('navbar')).toBeTruthy();
  });

  it('shows home by default', () => {
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });

  it('navigates to decks', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-decks'));
    expect(screen.getByTestId('decks-page')).toBeTruthy();
  });

  it('navigates to study', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-study'));
    expect(screen.getByTestId('study-page')).toBeTruthy();
  });

  it('navigates to progress', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-progress'));
    expect(screen.getByTestId('progress-page')).toBeTruthy();
  });
});

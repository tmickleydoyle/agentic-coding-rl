import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Navigation', () => {
  it('renders all nav links', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-decks')).toBeTruthy();
    expect(screen.getByTestId('nav-study')).toBeTruthy();
    expect(screen.getByTestId('nav-stats')).toBeTruthy();
  });

  it('home active by default', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home').getAttribute('data-active')).toBe('true');
  });

  it('navigates to decks', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-decks'));
    expect(screen.getByTestId('deck-list')).toBeTruthy();
    expect(screen.getByTestId('nav-decks').getAttribute('data-active')).toBe('true');
  });

  it('navigates to study', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-study'));
    expect(screen.getByTestId('study-deck-select')).toBeTruthy();
  });

  it('navigates to stats', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-stats'));
    expect(screen.getByTestId('stats-list')).toBeTruthy();
  });
});

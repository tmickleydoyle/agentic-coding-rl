import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Dashboard', () => {
  it('shows deck count', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-deck-count').textContent).toBe('2');
  });

  it('shows card count', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-card-count').textContent).toBe('3');
  });

  it('shows session count', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-session-count').textContent).toBe('0');
  });
});

describe('Decks', () => {
  it('lists seed decks', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-decks'));
    expect(screen.getAllByTestId('deck-item').length).toBe(2);
  });

  it('adds a new deck', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-decks'));
    fireEvent.change(screen.getByTestId('deck-name-input'), { target: { value: 'German Greetings' } });
    fireEvent.change(screen.getByTestId('deck-lang-input'), { target: { value: 'German' } });
    fireEvent.click(screen.getByTestId('deck-submit'));
    expect(screen.getAllByTestId('deck-item').length).toBe(3);
  });

  it('deletes a deck', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-decks'));
    fireEvent.click(screen.getAllByTestId('deck-delete')[0]);
    expect(screen.getAllByTestId('deck-item').length).toBe(1);
  });

  it('shows cards for each deck', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-decks'));
    const cardItems = screen.getAllByTestId('card-item');
    expect(cardItems.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Study', () => {
  it('shows current card front when deck selected', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-study'));
    fireEvent.change(screen.getByTestId('study-deck-select'), { target: { value: 'd1' } });
    expect(screen.getByTestId('study-card-front')).toBeTruthy();
  });

  it('reveals back when flipped', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-study'));
    fireEvent.change(screen.getByTestId('study-deck-select'), { target: { value: 'd1' } });
    fireEvent.click(screen.getByTestId('study-flip'));
    expect(screen.getByTestId('study-card-back')).toBeTruthy();
  });

  it('navigates to next card', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-study'));
    fireEvent.change(screen.getByTestId('study-deck-select'), { target: { value: 'd1' } });
    const firstFront = screen.getByTestId('study-card-front').textContent;
    fireEvent.click(screen.getByTestId('study-next'));
    const secondFront = screen.getByTestId('study-card-front').textContent;
    expect(secondFront).not.toBe(firstFront);
  });

  it('marks card known', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-study'));
    fireEvent.change(screen.getByTestId('study-deck-select'), { target: { value: 'd1' } });
    fireEvent.click(screen.getByTestId('study-mark-known'));
    expect(screen.getByTestId('study-progress').textContent).toContain('1/');
  });
});

describe('Stats', () => {
  it('shows stats for each deck', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-stats'));
    expect(screen.getAllByTestId('stats-item').length).toBe(2);
  });
});

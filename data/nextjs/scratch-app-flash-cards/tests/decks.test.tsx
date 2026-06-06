import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Decks and Cards', () => {
  it('lists seed decks', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-decks'));
    expect(screen.getByTestId('deck-item-d1')).toBeTruthy();
    expect(screen.getByTestId('deck-item-d2')).toBeTruthy();
  });

  it('adds a deck', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-decks'));
    fireEvent.change(screen.getByTestId('deck-name-input'), { target: { value: 'Science' } });
    fireEvent.click(screen.getByTestId('add-deck-btn'));
    expect(screen.getByText('Science')).toBeTruthy();
  });

  it('rejects empty deck name', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-decks'));
    fireEvent.click(screen.getByTestId('add-deck-btn'));
    expect(screen.getByTestId('deck-error')).toBeTruthy();
  });

  it('deletes a deck', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-decks'));
    fireEvent.click(screen.getByTestId('delete-deck-d1'));
    expect(screen.queryByTestId('deck-item-d1')).toBeNull();
  });

  it('adds a card to a deck', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-decks'));
    fireEvent.change(screen.getByTestId('card-deck-select'), { target: { value: 'd1' } });
    fireEvent.change(screen.getByTestId('card-front-input'), { target: { value: 'Cat' } });
    fireEvent.change(screen.getByTestId('card-back-input'), { target: { value: 'Gato' } });
    fireEvent.click(screen.getByTestId('add-card-btn'));
    expect(screen.getByText('Cat')).toBeTruthy();
  });

  it('rejects card with empty front', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-decks'));
    fireEvent.change(screen.getByTestId('card-deck-select'), { target: { value: 'd1' } });
    fireEvent.change(screen.getByTestId('card-back-input'), { target: { value: 'back' } });
    fireEvent.click(screen.getByTestId('add-card-btn'));
    expect(screen.getByTestId('card-error')).toBeTruthy();
  });

  it('deleting deck removes its cards', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-decks'));
    fireEvent.click(screen.getByTestId('delete-deck-d1'));
    expect(screen.queryByTestId('card-item-c1')).toBeNull();
    expect(screen.queryByTestId('card-item-c2')).toBeNull();
  });

  it('home page shows deck and card count', () => {
    render(<App />);
    expect(screen.getByTestId('deck-count').textContent).toContain('2');
    expect(screen.getByTestId('card-count').textContent).toContain('3');
  });
});

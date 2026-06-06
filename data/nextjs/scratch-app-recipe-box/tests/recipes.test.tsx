import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

beforeEach(() => { cleanup(); });

describe('Home page', () => {
  it('shows seed recipe count', () => {
    render(<App />);
    expect(screen.getByTestId('recipe-count').textContent).toBe('3');
  });
});

describe('Recipes page', () => {
  it('shows all seed recipes', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-recipes'));
    expect(screen.getByTestId('recipe-row-r1')).toBeTruthy();
    expect(screen.getByTestId('recipe-row-r2')).toBeTruthy();
    expect(screen.getByTestId('recipe-row-r3')).toBeTruthy();
  });

  it('adds a new recipe', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-recipes'));
    fireEvent.change(screen.getByTestId('recipe-title'), { target: { value: 'Pizza' } });
    fireEvent.change(screen.getByTestId('recipe-cuisine'), { target: { value: 'Italian' } });
    fireEvent.change(screen.getByTestId('recipe-preptime'), { target: { value: '30' } });
    fireEvent.change(screen.getByTestId('recipe-ingredients'), { target: { value: 'dough,cheese' } });
    fireEvent.change(screen.getByTestId('recipe-instructions'), { target: { value: 'Bake it.' } });
    fireEvent.click(screen.getByTestId('add-recipe-btn'));
    expect(screen.getByText(/Pizza/)).toBeTruthy();
  });

  it('rejects empty title', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-recipes'));
    fireEvent.click(screen.getByTestId('add-recipe-btn'));
    expect(screen.getByTestId('recipe-error')).toBeTruthy();
  });

  it('toggles favorite', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-recipes'));
    fireEvent.click(screen.getByTestId('toggle-favorite-r2'));
    fireEvent.click(screen.getByTestId('nav-favorites'));
    expect(screen.getByTestId('recipe-row-r2')).toBeTruthy();
  });
});

describe('Ingredients page', () => {
  it('lists unique ingredients from all recipes', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-ingredients'));
    expect(screen.getByTestId('ingredient-item-pasta')).toBeTruthy();
    expect(screen.getByTestId('ingredient-item-chicken')).toBeTruthy();
  });

  it('deduplicates parmesan (appears in 2 recipes)', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-ingredients'));
    const items = screen.getAllByTestId(/^ingredient-item-parmesan/);
    expect(items.length).toBe(1);
  });
});

describe('Favorites page', () => {
  it('shows only favorited recipes', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-favorites'));
    expect(screen.getByTestId('recipe-row-r1')).toBeTruthy();
    expect(screen.queryByTestId('recipe-row-r2')).toBeNull();
  });
});

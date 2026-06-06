import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

beforeEach(() => { cleanup(); });

describe('Navigation', () => {
  it('renders home page by default', () => {
    render(<App />);
    expect(screen.getByTestId('recipe-count')).toBeTruthy();
  });

  it('nav-recipes shows recipe list', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-recipes'));
    expect(screen.getByTestId('add-recipe-btn')).toBeTruthy();
  });

  it('nav-ingredients shows ingredient list', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-ingredients'));
    expect(screen.getByTestId('ingredient-list')).toBeTruthy();
  });

  it('nav-favorites shows favorites', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-favorites'));
    expect(screen.getByTestId('favorites-list')).toBeTruthy();
  });

  it('nav-home returns to home', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-recipes'));
    fireEvent.click(screen.getByTestId('nav-home'));
    expect(screen.getByTestId('recipe-count')).toBeTruthy();
  });
});

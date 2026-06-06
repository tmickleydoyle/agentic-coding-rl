import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Navigation', () => {
  it('shows navbar', () => { render(<App />); expect(screen.getByTestId('navbar')).toBeTruthy(); });
  it('home by default', () => { render(<App />); expect(screen.getByTestId('home-page')).toBeTruthy(); });
  it('navigates to recipes', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-recipes'));
    expect(screen.getByTestId('recipes-page')).toBeTruthy();
  });
  it('navigates to planner', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-planner'));
    expect(screen.getByTestId('planner-page')).toBeTruthy();
  });
  it('navigates to shopping', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-shopping'));
    expect(screen.getByTestId('shopping-page')).toBeTruthy();
  });
});

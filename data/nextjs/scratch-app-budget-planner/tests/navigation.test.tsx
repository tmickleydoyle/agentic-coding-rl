import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Navigation', () => {
  it('shows navbar', () => { render(<App />); expect(screen.getByTestId('navbar')).toBeTruthy(); });
  it('home by default', () => { render(<App />); expect(screen.getByTestId('home-page')).toBeTruthy(); });
  it('navigates to transactions', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-transactions'));
    expect(screen.getByTestId('transactions-page')).toBeTruthy();
  });
  it('navigates to categories', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-categories'));
    expect(screen.getByTestId('categories-page')).toBeTruthy();
  });
  it('navigates to summary', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-summary'));
    expect(screen.getByTestId('summary-page')).toBeTruthy();
  });
});

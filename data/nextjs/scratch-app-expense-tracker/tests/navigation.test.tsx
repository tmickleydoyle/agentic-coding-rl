import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

beforeEach(() => { cleanup(); });

describe('Navigation', () => {
  it('renders home page by default', () => {
    render(<App />);
    expect(screen.getByTestId('total-spent')).toBeTruthy();
  });

  it('nav-expenses navigates to expenses page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-expenses'));
    expect(screen.getByTestId('add-expense-btn')).toBeTruthy();
  });

  it('nav-categories navigates to categories page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-categories'));
    expect(screen.getByTestId('add-category-btn')).toBeTruthy();
  });

  it('nav-summary navigates to summary page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-summary'));
    expect(screen.getByTestId('summary-row-Food')).toBeTruthy();
  });

  it('nav-home returns to home page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-expenses'));
    fireEvent.click(screen.getByTestId('nav-home'));
    expect(screen.getByTestId('total-spent')).toBeTruthy();
  });
});

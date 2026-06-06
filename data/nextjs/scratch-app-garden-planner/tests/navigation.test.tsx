import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Navigation', () => {
  it('renders all nav links', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-plants')).toBeTruthy();
    expect(screen.getByTestId('nav-beds')).toBeTruthy();
    expect(screen.getByTestId('nav-log')).toBeTruthy();
  });

  it('home active by default', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home').getAttribute('data-active')).toBe('true');
  });

  it('navigates to plants', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-plants'));
    expect(screen.getByTestId('plant-list')).toBeTruthy();
    expect(screen.getByTestId('nav-plants').getAttribute('data-active')).toBe('true');
  });

  it('navigates to beds', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-beds'));
    expect(screen.getByTestId('bed-list')).toBeTruthy();
  });

  it('navigates to log', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-log'));
    expect(screen.getByTestId('log-list')).toBeTruthy();
  });
});

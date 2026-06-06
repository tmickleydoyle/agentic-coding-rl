import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Navigation', () => {
  it('shows navbar', () => { render(<App />); expect(screen.getByTestId('navbar')).toBeTruthy(); });
  it('home by default', () => { render(<App />); expect(screen.getByTestId('home-page')).toBeTruthy(); });
  it('navigates to groups', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-groups'));
    expect(screen.getByTestId('groups-page')).toBeTruthy();
  });
  it('navigates to expenses', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-expenses'));
    expect(screen.getByTestId('expenses-page')).toBeTruthy();
  });
  it('navigates to settle', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-settle'));
    expect(screen.getByTestId('settle-page')).toBeTruthy();
  });
});

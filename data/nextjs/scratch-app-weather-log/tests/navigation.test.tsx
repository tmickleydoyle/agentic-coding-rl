import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Navigation', () => {
  it('shows navbar', () => { render(<App />); expect(screen.getByTestId('navbar')).toBeTruthy(); });
  it('home by default', () => { render(<App />); expect(screen.getByTestId('home-page')).toBeTruthy(); });
  it('navigates to log', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-log'));
    expect(screen.getByTestId('log-page')).toBeTruthy();
  });
  it('navigates to charts', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-charts'));
    expect(screen.getByTestId('charts-page')).toBeTruthy();
  });
  it('navigates to settings', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-settings'));
    expect(screen.getByTestId('settings-page')).toBeTruthy();
  });
});

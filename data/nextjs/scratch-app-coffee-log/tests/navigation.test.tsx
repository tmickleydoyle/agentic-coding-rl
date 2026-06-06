import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Navigation', () => {
  it('renders all nav links', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-log')).toBeTruthy();
    expect(screen.getByTestId('nav-beans')).toBeTruthy();
    expect(screen.getByTestId('nav-stats')).toBeTruthy();
  });

  it('home active by default', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home').getAttribute('data-active')).toBe('true');
  });

  it('navigates to log', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-log'));
    expect(screen.getByTestId('brew-list')).toBeTruthy();
    expect(screen.getByTestId('nav-log').getAttribute('data-active')).toBe('true');
  });

  it('navigates to beans', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-beans'));
    expect(screen.getByTestId('bean-list')).toBeTruthy();
  });

  it('navigates to stats', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-stats'));
    expect(screen.getByTestId('stats-methods-list')).toBeTruthy();
  });
});

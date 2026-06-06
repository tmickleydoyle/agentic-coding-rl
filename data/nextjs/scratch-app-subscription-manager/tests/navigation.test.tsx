import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Navigation', () => {
  it('renders all nav links', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-subscriptions')).toBeTruthy();
    expect(screen.getByTestId('nav-calendar')).toBeTruthy();
    expect(screen.getByTestId('nav-stats')).toBeTruthy();
  });

  it('home is active by default', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home').getAttribute('data-active')).toBe('true');
  });

  it('navigates to subscriptions page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-subscriptions'));
    expect(screen.getByTestId('sub-list')).toBeTruthy();
    expect(screen.getByTestId('nav-subscriptions').getAttribute('data-active')).toBe('true');
  });

  it('navigates to calendar page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-calendar'));
    expect(screen.getByTestId('calendar-list')).toBeTruthy();
  });

  it('navigates to stats page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-stats'));
    expect(screen.getByTestId('stats-total-cost')).toBeTruthy();
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Navigation', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders navbar with all route buttons', () => {
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-roster')).toBeTruthy();
    expect(screen.getByTestId('nav-schedule')).toBeTruthy();
    expect(screen.getByTestId('nav-assignments')).toBeTruthy();
  });

  it('home is active by default', () => {
    expect(screen.getByTestId('nav-home').getAttribute('data-active')).toBe('true');
    expect(screen.getByTestId('nav-roster').getAttribute('data-active')).toBe('false');
  });

  it('navigates to roster page', () => {
    fireEvent.click(screen.getByTestId('nav-roster'));
    expect(screen.getByTestId('roster-page')).toBeTruthy();
    expect(screen.getByTestId('nav-roster').getAttribute('data-active')).toBe('true');
  });

  it('navigates to schedule page', () => {
    fireEvent.click(screen.getByTestId('nav-schedule'));
    expect(screen.getByTestId('schedule-page')).toBeTruthy();
  });

  it('navigates to assignments page', () => {
    fireEvent.click(screen.getByTestId('nav-assignments'));
    expect(screen.getByTestId('assignments-page')).toBeTruthy();
  });

  it('home page buttons navigate correctly', () => {
    expect(screen.getByTestId('home-page')).toBeTruthy();
    fireEvent.click(screen.getByTestId('btn-roster'));
    expect(screen.getByTestId('roster-page')).toBeTruthy();
  });
});

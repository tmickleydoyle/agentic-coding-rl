import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Navigation', () => {
  it('renders all nav buttons', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-sessions')).toBeTruthy();
    expect(screen.getByTestId('nav-tutors')).toBeTruthy();
    expect(screen.getByTestId('nav-booking')).toBeTruthy();
  });

  it('home active by default', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home').getAttribute('data-active')).toBe('true');
  });

  it('navigates to sessions', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-sessions'));
    expect(screen.getByTestId('sessions-page')).toBeTruthy();
  });

  it('navigates to tutors', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-tutors'));
    expect(screen.getByTestId('tutors-page')).toBeTruthy();
  });

  it('navigates to booking', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-booking'));
    expect(screen.getByTestId('booking-page')).toBeTruthy();
  });

  it('home buttons navigate correctly', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('btn-tutors'));
    expect(screen.getByTestId('tutors-page')).toBeTruthy();
  });
});

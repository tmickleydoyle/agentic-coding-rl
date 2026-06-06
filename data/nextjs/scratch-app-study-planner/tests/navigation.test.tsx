import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Navigation', () => {
  it('renders the navbar with all links', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-subjects')).toBeTruthy();
    expect(screen.getByTestId('nav-sessions')).toBeTruthy();
    expect(screen.getByTestId('nav-stats')).toBeTruthy();
  });

  it('shows home page by default', () => {
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });

  it('navigates to subjects page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-subjects'));
    expect(screen.getByTestId('subjects-page')).toBeTruthy();
  });

  it('navigates to sessions page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-sessions'));
    expect(screen.getByTestId('sessions-page')).toBeTruthy();
  });

  it('navigates to stats page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-stats'));
    expect(screen.getByTestId('stats-page')).toBeTruthy();
  });

  it('can navigate back to home', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-subjects'));
    fireEvent.click(screen.getByTestId('nav-home'));
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });
});

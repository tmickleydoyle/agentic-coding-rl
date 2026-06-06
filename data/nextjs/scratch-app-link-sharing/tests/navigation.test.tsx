import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Link Sharing Navigation', () => {
  it('renders navbar', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-links')).toBeTruthy();
    expect(screen.getByTestId('nav-submit')).toBeTruthy();
  });

  it('shows home page by default', () => {
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });

  it('navigates to links page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-links'));
    expect(screen.getByTestId('links-page')).toBeTruthy();
  });

  it('navigates to submit page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-submit'));
    expect(screen.getByTestId('submit-page')).toBeTruthy();
  });

  it('navigates back to home', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-links'));
    fireEvent.click(screen.getByTestId('nav-home'));
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Group Chat Navigation', () => {
  it('renders navbar', () => {
    render(<App />);
    expect(screen.getByTestId('navbar')).toBeTruthy();
  });

  it('shows home page by default', () => {
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });

  it('navigates to rooms page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-rooms'));
    expect(screen.getByTestId('rooms-page')).toBeTruthy();
  });

  it('navigates back to home', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-rooms'));
    fireEvent.click(screen.getByTestId('nav-home'));
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });
});

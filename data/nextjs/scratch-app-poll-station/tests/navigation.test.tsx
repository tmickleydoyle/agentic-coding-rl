import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Poll Station Navigation', () => {
  it('shows home page by default', () => {
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });

  it('has nav links', () => {
    render(<App />);
    expect(screen.getByTestId('nav-polls')).toBeTruthy();
    expect(screen.getByTestId('nav-create')).toBeTruthy();
  });

  it('navigates to polls page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-polls'));
    expect(screen.getByTestId('polls-page')).toBeTruthy();
  });

  it('navigates to create page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-create'));
    expect(screen.getByTestId('create-page')).toBeTruthy();
  });

  it('navigates back to home', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-polls'));
    fireEvent.click(screen.getByTestId('nav-home'));
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });
});

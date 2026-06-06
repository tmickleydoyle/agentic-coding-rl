import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Forum Navigation', () => {
  it('renders navbar with all links', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-threads')).toBeTruthy();
    expect(screen.getByTestId('nav-new-thread')).toBeTruthy();
  });

  it('shows home page by default', () => {
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });

  it('navigates to threads page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-threads'));
    expect(screen.getByTestId('threads-page')).toBeTruthy();
  });

  it('navigates to new-thread page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-new-thread'));
    expect(screen.getByTestId('new-thread-page')).toBeTruthy();
  });

  it('navigates back to home from threads', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-threads'));
    fireEvent.click(screen.getByTestId('nav-home'));
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });
});

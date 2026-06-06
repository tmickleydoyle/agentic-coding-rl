import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

beforeEach(() => { cleanup(); });

describe('Navigation', () => {
  it('renders home page by default', () => {
    render(<App />);
    expect(screen.getByTestId('count-todo')).toBeTruthy();
  });

  it('nav-board shows board', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-board'));
    expect(screen.getByTestId('add-task-btn')).toBeTruthy();
  });

  it('nav-completed shows completed', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-completed'));
    expect(screen.getByTestId('task-card-t3')).toBeTruthy();
  });

  it('nav-settings shows settings', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-settings'));
    expect(screen.getByTestId('add-label-btn')).toBeTruthy();
  });

  it('nav-home returns home', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-board'));
    fireEvent.click(screen.getByTestId('nav-home'));
    expect(screen.getByTestId('count-todo')).toBeTruthy();
  });
});

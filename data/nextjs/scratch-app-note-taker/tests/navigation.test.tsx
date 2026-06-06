import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

beforeEach(() => { cleanup(); });

describe('Navigation', () => {
  it('renders home by default', () => {
    render(<App />);
    expect(screen.getByTestId('active-count')).toBeTruthy();
  });

  it('nav-notes goes to notes', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-notes'));
    expect(screen.getByTestId('add-note-btn')).toBeTruthy();
  });

  it('nav-tags goes to tags', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-tags'));
    expect(screen.getByTestId('tag-item-work')).toBeTruthy();
  });

  it('nav-archive goes to archive', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-archive'));
    expect(screen.getByTestId('archive-list')).toBeTruthy();
  });

  it('nav-home returns home', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-notes'));
    fireEvent.click(screen.getByTestId('nav-home'));
    expect(screen.getByTestId('active-count')).toBeTruthy();
  });
});

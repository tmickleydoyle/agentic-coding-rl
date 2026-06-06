import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

beforeEach(() => { cleanup(); });

describe('Navigation', () => {
  it('renders home page by default', () => {
    render(<App />);
    expect(screen.getByTestId('contact-count')).toBeTruthy();
  });

  it('nav-contacts navigates to contacts page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-contacts'));
    expect(screen.getByTestId('add-contact-btn')).toBeTruthy();
  });

  it('nav-groups navigates to groups page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-groups'));
    expect(screen.getByTestId('add-group-btn')).toBeTruthy();
  });

  it('nav-search navigates to search page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-search'));
    expect(screen.getByTestId('search-input')).toBeTruthy();
  });

  it('nav-home returns home', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-contacts'));
    fireEvent.click(screen.getByTestId('nav-home'));
    expect(screen.getByTestId('contact-count')).toBeTruthy();
  });
});

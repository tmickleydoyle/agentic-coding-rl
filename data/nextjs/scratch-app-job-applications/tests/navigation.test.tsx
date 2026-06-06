import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Navigation', () => {
  it('renders all nav links', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-applications')).toBeTruthy();
    expect(screen.getByTestId('nav-contacts')).toBeTruthy();
    expect(screen.getByTestId('nav-notes')).toBeTruthy();
  });

  it('home is active by default', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home').getAttribute('data-active')).toBe('true');
    expect(screen.getByTestId('nav-applications').getAttribute('data-active')).toBe('false');
  });

  it('navigates to applications', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-applications'));
    expect(screen.getByTestId('app-list')).toBeTruthy();
    expect(screen.getByTestId('nav-applications').getAttribute('data-active')).toBe('true');
  });

  it('navigates to contacts', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-contacts'));
    expect(screen.getByTestId('contact-list')).toBeTruthy();
  });

  it('navigates to notes', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-notes'));
    expect(screen.getByTestId('note-list')).toBeTruthy();
  });
});

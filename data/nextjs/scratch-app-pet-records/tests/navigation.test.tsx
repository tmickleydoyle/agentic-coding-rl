import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Navigation', () => {
  it('renders all nav links', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-pets')).toBeTruthy();
    expect(screen.getByTestId('nav-visits')).toBeTruthy();
    expect(screen.getByTestId('nav-medications')).toBeTruthy();
  });

  it('home active by default', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home').getAttribute('data-active')).toBe('true');
  });

  it('navigates to pets', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-pets'));
    expect(screen.getByTestId('pet-list')).toBeTruthy();
    expect(screen.getByTestId('nav-pets').getAttribute('data-active')).toBe('true');
  });

  it('navigates to visits', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-visits'));
    expect(screen.getByTestId('visit-list')).toBeTruthy();
  });

  it('navigates to medications', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-medications'));
    expect(screen.getByTestId('med-list')).toBeTruthy();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Navigation', () => {
  it('renders all nav buttons', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-certificates')).toBeTruthy();
    expect(screen.getByTestId('nav-skills')).toBeTruthy();
    expect(screen.getByTestId('nav-issued')).toBeTruthy();
  });

  it('home active by default', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home').getAttribute('data-active')).toBe('true');
  });

  it('navigates to certificates', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-certificates'));
    expect(screen.getByTestId('certificates-page')).toBeTruthy();
  });

  it('navigates to skills', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-skills'));
    expect(screen.getByTestId('skills-page')).toBeTruthy();
  });

  it('navigates to issued', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-issued'));
    expect(screen.getByTestId('issued-page')).toBeTruthy();
  });

  it('home buttons navigate correctly', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('btn-certificates'));
    expect(screen.getByTestId('certificates-page')).toBeTruthy();
  });
});

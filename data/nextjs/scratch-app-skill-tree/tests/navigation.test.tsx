import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Navigation', () => {
  it('renders all nav buttons', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-skills')).toBeTruthy();
    expect(screen.getByTestId('nav-paths')).toBeTruthy();
    expect(screen.getByTestId('nav-progress')).toBeTruthy();
  });

  it('home active by default', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home').getAttribute('data-active')).toBe('true');
  });

  it('navigates to skills', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-skills'));
    expect(screen.getByTestId('skills-page')).toBeTruthy();
  });

  it('navigates to paths', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-paths'));
    expect(screen.getByTestId('paths-page')).toBeTruthy();
  });

  it('navigates to progress', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-progress'));
    expect(screen.getByTestId('progress-page')).toBeTruthy();
  });

  it('home buttons navigate correctly', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('btn-skills'));
    expect(screen.getByTestId('skills-page')).toBeTruthy();
  });
});

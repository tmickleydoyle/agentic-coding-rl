import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Navigation', () => {
  it('renders all nav buttons', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-courses')).toBeTruthy();
    expect(screen.getByTestId('nav-profile')).toBeTruthy();
    expect(screen.getByTestId('nav-progress')).toBeTruthy();
  });

  it('home active by default', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home').getAttribute('data-active')).toBe('true');
  });

  it('navigates to courses page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-courses'));
    expect(screen.getByTestId('courses-page')).toBeTruthy();
  });

  it('navigates to profile page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-profile'));
    expect(screen.getByTestId('profile-page')).toBeTruthy();
  });

  it('navigates to progress page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-progress'));
    expect(screen.getByTestId('progress-page')).toBeTruthy();
  });

  it('home buttons navigate correctly', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('btn-courses'));
    expect(screen.getByTestId('courses-page')).toBeTruthy();
  });
});

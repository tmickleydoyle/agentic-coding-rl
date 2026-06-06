import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Navigation', () => {
  it('renders all nav buttons', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-attendance')).toBeTruthy();
    expect(screen.getByTestId('nav-students')).toBeTruthy();
    expect(screen.getByTestId('nav-summary')).toBeTruthy();
  });

  it('home active by default', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home').getAttribute('data-active')).toBe('true');
  });

  it('navigates to attendance page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-attendance'));
    expect(screen.getByTestId('attendance-page')).toBeTruthy();
  });

  it('navigates to students page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-students'));
    expect(screen.getByTestId('students-page')).toBeTruthy();
  });

  it('navigates to summary page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-summary'));
    expect(screen.getByTestId('summary-page')).toBeTruthy();
  });

  it('home buttons navigate correctly', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('btn-attendance'));
    expect(screen.getByTestId('attendance-page')).toBeTruthy();
  });
});

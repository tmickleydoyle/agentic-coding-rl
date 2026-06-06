import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Navigation', () => {
  it('renders all nav buttons', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-students')).toBeTruthy();
    expect(screen.getByTestId('nav-grades')).toBeTruthy();
    expect(screen.getByTestId('nav-reports')).toBeTruthy();
  });

  it('home is active by default', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home').getAttribute('data-active')).toBe('true');
  });

  it('navigates to students page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-students'));
    expect(screen.getByTestId('students-page')).toBeTruthy();
    expect(screen.getByTestId('nav-students').getAttribute('data-active')).toBe('true');
  });

  it('navigates to grades page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-grades'));
    expect(screen.getByTestId('grades-page')).toBeTruthy();
  });

  it('navigates to reports page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-reports'));
    expect(screen.getByTestId('reports-page')).toBeTruthy();
  });

  it('home buttons navigate correctly', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('btn-students'));
    expect(screen.getByTestId('students-page')).toBeTruthy();
  });
});

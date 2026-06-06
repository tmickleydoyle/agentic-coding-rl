import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Navigation', () => {
  it('renders all nav buttons', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-modules')).toBeTruthy();
    expect(screen.getByTestId('nav-lessons')).toBeTruthy();
    expect(screen.getByTestId('nav-preview')).toBeTruthy();
  });

  it('home active by default', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home').getAttribute('data-active')).toBe('true');
  });

  it('navigates to modules', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-modules'));
    expect(screen.getByTestId('modules-page')).toBeTruthy();
  });

  it('navigates to lessons', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-lessons'));
    expect(screen.getByTestId('lessons-page')).toBeTruthy();
  });

  it('navigates to preview', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-preview'));
    expect(screen.getByTestId('preview-page')).toBeTruthy();
  });

  it('home buttons navigate correctly', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('btn-modules'));
    expect(screen.getByTestId('modules-page')).toBeTruthy();
  });
});

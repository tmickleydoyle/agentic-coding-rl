import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Navigation', () => {
  it('renders nav links', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-clients')).toBeTruthy();
    expect(screen.getByTestId('nav-projects')).toBeTruthy();
    expect(screen.getByTestId('nav-invoices')).toBeTruthy();
  });

  it('home link is active by default', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home').getAttribute('data-active')).toBe('true');
    expect(screen.getByTestId('nav-clients').getAttribute('data-active')).toBe('false');
  });

  it('navigates to clients page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-clients'));
    expect(screen.getByTestId('client-list')).toBeTruthy();
    expect(screen.getByTestId('nav-clients').getAttribute('data-active')).toBe('true');
  });

  it('navigates to projects page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-projects'));
    expect(screen.getByTestId('project-list')).toBeTruthy();
  });

  it('navigates to invoices page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-invoices'));
    expect(screen.getByTestId('invoice-list')).toBeTruthy();
  });

  it('navigates back to home', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-clients'));
    fireEvent.click(screen.getByTestId('nav-home'));
    expect(screen.getByTestId('dashboard-clients-count')).toBeTruthy();
  });
});

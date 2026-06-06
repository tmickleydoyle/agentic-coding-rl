import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

beforeEach(() => { cleanup(); });

describe('Navigation', () => {
  it('renders home by default', () => {
    render(<App />);
    expect(screen.getByTestId('total-hours')).toBeTruthy();
  });

  it('nav-logs shows log page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-logs'));
    expect(screen.getByTestId('add-log-btn')).toBeTruthy();
  });

  it('nav-projects shows projects', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-projects'));
    expect(screen.getByTestId('add-project-btn')).toBeTruthy();
  });

  it('nav-report shows report', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-report'));
    expect(screen.getByTestId('report-row-p1')).toBeTruthy();
  });

  it('nav-home returns home', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-logs'));
    fireEvent.click(screen.getByTestId('nav-home'));
    expect(screen.getByTestId('total-hours')).toBeTruthy();
  });
});

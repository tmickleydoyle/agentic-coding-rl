import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Home Page', () => {
  it('shows app title', () => {
    render(<App />);
    expect(screen.getByTestId('app-title').textContent).toBe('Attendance Tracker');
  });

  it('shows student count', () => {
    render(<App />);
    expect(screen.getByTestId('total-students').textContent).toContain('4');
  });
});

describe('Students Page', () => {
  it('lists seed students', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-students'));
    expect(screen.getByTestId('student-name-1').textContent).toBe('Alice Johnson');
    expect(screen.getByTestId('student-name-2').textContent).toBe('Bob Martinez');
  });

  it('shows total count', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-students'));
    expect(screen.getByTestId('student-count').textContent).toContain('4');
  });

  it('shows error on empty name', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-students'));
    fireEvent.click(screen.getByTestId('add-student-btn'));
    expect(screen.getByTestId('student-error')).toBeTruthy();
  });
});

describe('Attendance Page', () => {
  it('shows all students in list', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-attendance'));
    expect(screen.getByTestId('attendance-name-1').textContent).toBe('Alice Johnson');
    expect(screen.getByTestId('attendance-status-1')).toBeTruthy();
  });

  it('shows date input', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-attendance'));
    expect(screen.getByTestId('date-input')).toBeTruthy();
  });
});

describe('Summary Page', () => {
  it('shows per-student stats', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-summary'));
    expect(screen.getByTestId('summary-name-1').textContent).toBe('Alice Johnson');
    expect(screen.getByTestId('summary-present-1')).toBeTruthy();
  });

  it('shows total sessions count', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-summary'));
    // 2 distinct dates in seed data
    expect(screen.getByTestId('total-sessions').textContent).toContain('2');
  });
});

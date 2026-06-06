import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Home Page', () => {
  it('shows app title', () => {
    render(<App />);
    expect(screen.getByTestId('app-title').textContent).toBe('Gradebook');
  });

  it('shows student and grade counts', () => {
    render(<App />);
    expect(screen.getByTestId('total-students').textContent).toContain('3');
    expect(screen.getByTestId('total-grades').textContent).toContain('4');
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
    expect(screen.getByTestId('student-count').textContent).toContain('3');
  });

  it('shows error on empty name', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-students'));
    fireEvent.click(screen.getByTestId('add-student-btn'));
    expect(screen.getByTestId('student-error')).toBeTruthy();
  });
});

describe('Grades Page', () => {
  it('lists seed grades', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-grades'));
    expect(screen.getByTestId('grade-score-1').textContent).toBe('92/100');
    expect(screen.getByTestId('grade-subject-1').textContent).toBe('Math');
  });

  it('shows student name in grade row', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-grades'));
    expect(screen.getByTestId('grade-student-1').textContent).toBe('Alice Johnson');
  });
});

describe('Reports Page', () => {
  it('shows per-student averages', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-reports'));
    // Alice: (92+85)/2 = 88.5
    expect(screen.getByTestId('report-avg-1').textContent).toBe('88.5');
  });

  it('shows letter grade', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-reports'));
    expect(screen.getByTestId('report-letter-1').textContent).toBe('B');
    // Carol: 95 → A
    expect(screen.getByTestId('report-letter-3').textContent).toBe('A');
  });

  it('shows class average', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-reports'));
    expect(screen.getByTestId('class-average')).toBeTruthy();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Home Page', () => {
  it('shows welcome message with student name', () => {
    render(<App />);
    expect(screen.getByTestId('welcome-msg').textContent).toContain('Alex Rivera');
  });

  it('shows enrolled count', () => {
    render(<App />);
    expect(screen.getByTestId('enrolled-count').textContent).toContain('2');
  });
});

describe('Courses Page', () => {
  it('lists all courses', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-courses'));
    expect(screen.getByTestId('course-title-1').textContent).toBe('Algebra II');
    expect(screen.getByTestId('course-title-3').textContent).toBe('World History');
  });

  it('shows enrolled status', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-courses'));
    expect(screen.getByTestId('course-status-1').textContent).toBe('Enrolled');
    expect(screen.getByTestId('course-status-3').textContent).toBe('Available');
  });

  it('shows enroll/drop buttons based on status', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-courses'));
    expect(screen.getByTestId('drop-1')).toBeTruthy();
    expect(screen.getByTestId('enroll-3')).toBeTruthy();
  });
});

describe('Profile Page', () => {
  it('shows student profile info', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-profile'));
    expect(screen.getByTestId('profile-name').textContent).toBe('Alex Rivera');
    expect(screen.getByTestId('profile-email').textContent).toBe('alex@school.edu');
    expect(screen.getByTestId('profile-grade').textContent).toBe('10th');
  });
});

describe('Progress Page', () => {
  it('shows enrolled courses with progress', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-progress'));
    expect(screen.getByTestId('progress-count-1').textContent).toBe('6/12');
    expect(screen.getByTestId('progress-pct-1').textContent).toBe('50%');
  });
});

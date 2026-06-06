import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Home Page', () => {
  it('shows app title', () => {
    render(<App />);
    expect(screen.getByTestId('app-title').textContent).toBe('Tutor Sessions');
  });

  it('shows total and upcoming session counts', () => {
    render(<App />);
    expect(screen.getByTestId('total-sessions').textContent).toContain('3');
    expect(screen.getByTestId('upcoming-sessions').textContent).toContain('2');
  });
});

describe('Tutors Page', () => {
  it('lists tutors with names and ratings', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-tutors'));
    expect(screen.getByTestId('tutor-name-1').textContent).toBe('Dr. Allen');
    expect(screen.getByTestId('tutor-rating-1').textContent).toContain('4.8');
  });

  it('shows availability badge', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-tutors'));
    expect(screen.getByTestId('tutor-availability-1').textContent).toBe('Available');
    expect(screen.getByTestId('tutor-availability-3').textContent).toBe('Unavailable');
  });

  it('shows Book button only for available tutors', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-tutors'));
    expect(screen.getByTestId('book-tutor-1')).toBeTruthy();
    expect(screen.queryByTestId('book-tutor-3')).toBeNull();
  });
});

describe('Sessions Page', () => {
  it('lists all sessions', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-sessions'));
    expect(screen.getByTestId('session-student-1').textContent).toBe('Alice');
    expect(screen.getByTestId('session-status-1').textContent).toBe('completed');
  });

  it('shows duration with min suffix', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-sessions'));
    expect(screen.getByTestId('session-duration-1').textContent).toContain('60');
  });

  it('shows cancel button for scheduled sessions', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-sessions'));
    expect(screen.getByTestId('cancel-session-2')).toBeTruthy();
    expect(screen.queryByTestId('cancel-session-1')).toBeNull();
  });

  it('filter buttons exist', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-sessions'));
    expect(screen.getByTestId('filter-all')).toBeTruthy();
    expect(screen.getByTestId('filter-scheduled')).toBeTruthy();
  });
});

describe('Booking Page', () => {
  it('shows booking form', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-booking'));
    expect(screen.getByTestId('booking-form')).toBeTruthy();
    expect(screen.getByTestId('booking-tutor-select')).toBeTruthy();
  });
});

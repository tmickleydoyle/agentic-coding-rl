import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Home Page', () => {
  it('displays class info', () => {
    render(<App />);
    expect(screen.getByTestId('class-name').textContent).toBe('Math 101');
    expect(screen.getByTestId('teacher').textContent).toBe('Ms. Smith');
    expect(screen.getByTestId('room').textContent).toBe('A204');
  });

  it('displays period', () => {
    render(<App />);
    expect(screen.getByTestId('period').textContent).toContain('2');
  });
});

describe('Schedule Page', () => {
  it('shows formatted schedule', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-schedule'));
    expect(screen.getByTestId('schedule-days').textContent).toContain('Mon');
    expect(screen.getByTestId('schedule-time').textContent).toContain('09:00');
    expect(screen.getByTestId('schedule-formatted').textContent).toContain('09:00 - 09:50');
  });
});

describe('Roster Page', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: 5, name: 'Eve Taylor' }),
    }) as unknown as typeof fetch;
  });

  it('shows student count', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-roster'));
    expect(screen.getByTestId('student-count')).toBeTruthy();
  });

  it('shows no-students when empty', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-roster'));
    expect(screen.getByTestId('no-students')).toBeTruthy();
  });

  it('adds a student', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-roster'));
    fireEvent.change(screen.getByTestId('student-name-input'), { target: { value: 'Eve Taylor' } });
    fireEvent.click(screen.getByTestId('add-student-btn'));
    await waitFor(() => {
      expect(screen.queryByTestId('no-students')).toBeNull();
    });
  });

  it('shows error on empty name', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-roster'));
    fireEvent.click(screen.getByTestId('add-student-btn'));
    expect(screen.getByTestId('add-error')).toBeTruthy();
  });
});

describe('Assignments Page', () => {
  it('shows no-assignments when empty', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-assignments'));
    expect(screen.getByTestId('no-assignments')).toBeTruthy();
  });

  it('toggles assignment form', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-assignments'));
    expect(screen.queryByTestId('assignment-form')).toBeNull();
    fireEvent.click(screen.getByTestId('add-assignment-btn'));
    expect(screen.getByTestId('assignment-form')).toBeTruthy();
  });
});

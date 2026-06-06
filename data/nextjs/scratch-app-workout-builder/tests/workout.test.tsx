import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Workout Builder Features', () => {
  it('home shows seed counts', () => {
    render(<App />);
    expect(screen.getByTestId('exercise-count').textContent).toContain('3');
    expect(screen.getByTestId('routine-count').textContent).toContain('1');
    expect(screen.getByTestId('session-count').textContent).toContain('0');
  });

  it('lists seed exercises', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-exercises'));
    expect(screen.getByTestId('exercise-item-ex1')).toBeTruthy();
    expect(screen.getByTestId('exercise-item-ex3')).toBeTruthy();
  });

  it('adds an exercise', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-exercises'));
    fireEvent.change(screen.getByTestId('exercise-name-input'), { target: { value: 'Pull-up' } });
    fireEvent.click(screen.getByTestId('add-exercise-btn'));
    expect(screen.getByText('Pull-up')).toBeTruthy();
  });

  it('rejects empty exercise name', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-exercises'));
    fireEvent.click(screen.getByTestId('add-exercise-btn'));
    expect(screen.getByTestId('exercise-error')).toBeTruthy();
  });

  it('deletes an exercise removes from routine', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-exercises'));
    fireEvent.click(screen.getByTestId('delete-exercise-ex1'));
    fireEvent.click(screen.getByTestId('nav-routines'));
    const routineExercises = screen.getByTestId('routine-exercises-r1').textContent ?? '';
    expect(routineExercises).not.toContain('Push-up');
  });

  it('adds a routine', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-routines'));
    fireEvent.change(screen.getByTestId('routine-name-input'), { target: { value: 'Evening Stretch' } });
    fireEvent.click(screen.getByTestId('add-routine-btn'));
    expect(screen.getByText('Evening Stretch')).toBeTruthy();
  });

  it('logs a session', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-log'));
    fireEvent.change(screen.getByTestId('log-routine-select'), { target: { value: 'r1' } });
    fireEvent.change(screen.getByTestId('log-duration-input'), { target: { value: '25' } });
    fireEvent.click(screen.getByTestId('add-log-btn'));
    expect(screen.queryByTestId('log-error')).toBeNull();
    expect(screen.getByTestId('log-list').children.length).toBe(1);
  });

  it('rejects log with zero duration', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-log'));
    fireEvent.change(screen.getByTestId('log-routine-select'), { target: { value: 'r1' } });
    fireEvent.change(screen.getByTestId('log-duration-input'), { target: { value: '0' } });
    fireEvent.click(screen.getByTestId('add-log-btn'));
    expect(screen.getByTestId('log-error')).toBeTruthy();
  });
});

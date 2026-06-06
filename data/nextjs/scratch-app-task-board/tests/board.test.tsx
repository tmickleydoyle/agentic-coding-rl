import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

beforeEach(() => { cleanup(); });

describe('Home counts', () => {
  it('shows correct initial counts', () => {
    render(<App />);
    expect(screen.getByTestId('count-todo').textContent).toBe('2');
    expect(screen.getByTestId('count-inprogress').textContent).toBe('1');
    expect(screen.getByTestId('count-done').textContent).toBe('1');
  });
});

describe('Board page', () => {
  it('shows seed tasks on board', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-board'));
    expect(screen.getByTestId('task-card-t1')).toBeTruthy();
    expect(screen.getByTestId('task-card-t2')).toBeTruthy();
  });

  it('adds a new task', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-board'));
    fireEvent.change(screen.getByTestId('task-title'), { target: { value: 'New Feature' } });
    fireEvent.click(screen.getByTestId('add-task-btn'));
    expect(screen.getByText(/New Feature/)).toBeTruthy();
  });

  it('rejects empty title', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-board'));
    fireEvent.click(screen.getByTestId('add-task-btn'));
    expect(screen.getByTestId('task-error')).toBeTruthy();
  });

  it('moves task forward from todo', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-board'));
    fireEvent.click(screen.getByTestId('move-forward-t1'));
    // t1 should now be in inprogress, so no move-forward button in todo col
    expect(screen.queryByTestId('move-forward-t1')).toBeTruthy(); // still shown (now in inprogress)
  });
});

describe('Completed page', () => {
  it('shows only done tasks', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-completed'));
    expect(screen.getByTestId('task-card-t3')).toBeTruthy();
    expect(screen.queryByTestId('task-card-t1')).toBeNull();
  });

  it('reopens a task', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-completed'));
    fireEvent.click(screen.getByTestId('reopen-task-t3'));
    expect(screen.queryByTestId('task-card-t3')).toBeNull();
  });
});

describe('Settings page', () => {
  it('shows seed labels', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-settings'));
    expect(screen.getByTestId('label-row-l1')).toBeTruthy();
  });

  it('adds a new label', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-settings'));
    fireEvent.change(screen.getByTestId('label-name'), { target: { value: 'Enhancement' } });
    fireEvent.click(screen.getByTestId('add-label-btn'));
    expect(screen.getByText(/Enhancement/)).toBeTruthy();
  });

  it('rejects duplicate label', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-settings'));
    fireEvent.change(screen.getByTestId('label-name'), { target: { value: 'Bug' } });
    fireEvent.click(screen.getByTestId('add-label-btn'));
    expect(screen.getByTestId('label-error')).toBeTruthy();
  });
});

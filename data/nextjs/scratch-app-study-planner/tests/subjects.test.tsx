import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Subjects', () => {
  it('lists seed subjects', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-subjects'));
    expect(screen.getByTestId('subject-item-s1')).toBeTruthy();
    expect(screen.getByTestId('subject-item-s2')).toBeTruthy();
  });

  it('adds a new subject', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-subjects'));
    fireEvent.change(screen.getByTestId('subject-name-input'), { target: { value: 'Science' } });
    fireEvent.click(screen.getByTestId('add-subject-btn'));
    expect(screen.getByText('Science')).toBeTruthy();
  });

  it('rejects duplicate subject name', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-subjects'));
    fireEvent.change(screen.getByTestId('subject-name-input'), { target: { value: 'Math' } });
    fireEvent.click(screen.getByTestId('add-subject-btn'));
    expect(screen.getByTestId('subject-error')).toBeTruthy();
  });

  it('rejects empty subject name', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-subjects'));
    fireEvent.click(screen.getByTestId('add-subject-btn'));
    expect(screen.getByTestId('subject-error')).toBeTruthy();
  });

  it('deletes a subject', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-subjects'));
    fireEvent.click(screen.getByTestId('delete-subject-s1'));
    expect(screen.queryByTestId('subject-item-s1')).toBeNull();
  });

  it('deleting a subject removes its sessions', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-subjects'));
    fireEvent.click(screen.getByTestId('delete-subject-s1'));
    fireEvent.click(screen.getByTestId('nav-sessions'));
    expect(screen.queryByTestId('session-item-ss1')).toBeNull();
  });

  it('stats reflect deleted subject sessions', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-subjects'));
    fireEvent.click(screen.getByTestId('delete-subject-s1'));
    fireEvent.click(screen.getByTestId('nav-stats'));
    expect(screen.getByTestId('total-sessions').textContent).toContain('1');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Typing Practice Features', () => {
  it('home shows seed scores count', () => {
    render(<App />);
    expect(screen.getByTestId('tests-taken').textContent).toContain('2');
  });

  it('leaderboard shows seed scores sorted by WPM', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-leaderboard'));
    const items = screen.getByTestId('leaderboard-list').children;
    expect(items.length).toBe(2);
    // Alice (72 WPM) should be first
    expect(screen.getByTestId('score-name-sc1').textContent).toBe('Alice');
  });

  it('practice page shows a prompt', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-practice'));
    expect(screen.getByTestId('prompt-text').textContent.length).toBeGreaterThan(0);
  });

  it('practice submission with empty input shows error', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-practice'));
    fireEvent.click(screen.getByTestId('submit-typing-btn'));
    expect(screen.getByTestId('practice-error')).toBeTruthy();
  });

  it('practice submission with text shows result', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-practice'));
    fireEvent.change(screen.getByTestId('typing-input'), { target: { value: 'The quick brown fox' } });
    fireEvent.click(screen.getByTestId('submit-typing-btn'));
    expect(screen.getByTestId('practice-result')).toBeTruthy();
  });

  it('settings saves name', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-settings'));
    fireEvent.change(screen.getByTestId('settings-name-input'), { target: { value: 'Charlie' } });
    fireEvent.click(screen.getByTestId('save-settings-btn'));
    expect(screen.getByTestId('current-name').textContent).toContain('Charlie');
  });

  it('settings saves duration', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-settings'));
    fireEvent.change(screen.getByTestId('settings-duration-select'), { target: { value: '60' } });
    fireEvent.click(screen.getByTestId('save-settings-btn'));
    expect(screen.getByTestId('current-duration').textContent).toContain('60');
  });

  it('home personal best shows highest WPM', () => {
    render(<App />);
    expect(screen.getByTestId('personal-best').textContent).toContain('72');
  });
});

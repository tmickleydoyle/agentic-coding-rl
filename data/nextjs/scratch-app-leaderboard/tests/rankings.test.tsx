import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../app/page';
import { __reset } from '../lib/store';

beforeEach(() => { __reset(); });

describe('Leaderboard Rankings Feature', () => {
  it('shows player rankings', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-rankings'));
    await waitFor(() => expect(screen.getByTestId('rank-row-alice')).toBeTruthy());
    expect(screen.getByTestId('rank-row-bob')).toBeTruthy();
    expect(screen.getByTestId('rank-row-carol')).toBeTruthy();
  });

  it('alice is ranked first with score 1350', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-rankings'));
    await waitFor(() => screen.getByTestId('rank-pos-alice'));
    expect(screen.getByTestId('rank-pos-alice').textContent).toBe('1');
    expect(screen.getByTestId('rank-score-alice').textContent).toBe('1350');
  });

  it('game filter shows only chess players', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-rankings'));
    await waitFor(() => screen.getByTestId('game-filter'));
    fireEvent.change(screen.getByTestId('game-filter'), { target: { value: 'Chess' } });
    expect(screen.queryByTestId('rank-row-carol')).toBeNull();
    expect(screen.getByTestId('rank-row-alice')).toBeTruthy();
  });

  it('clicking player navigates to history', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-rankings'));
    await waitFor(() => screen.getByTestId('rank-player-alice'));
    fireEvent.click(screen.getByTestId('rank-player-alice'));
    expect(screen.getByTestId('history-page')).toBeTruthy();
    expect(screen.getByTestId('history-player').textContent).toBe('alice');
  });

  it('history shows player scores', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-rankings'));
    await waitFor(() => screen.getByTestId('rank-player-alice'));
    fireEvent.click(screen.getByTestId('rank-player-alice'));
    await waitFor(() => screen.getByTestId('history-score-s1'));
    expect(screen.getByTestId('history-score-s3')).toBeTruthy();
  });

  it('submit form validation error', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-submit'));
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(screen.getByTestId('form-error')).toBeTruthy();
  });

  it('submit shows success on valid form', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-submit'));
    fireEvent.change(screen.getByTestId('player-input'), { target: { value: 'dave' } });
    fireEvent.change(screen.getByTestId('score-input'), { target: { value: '500' } });
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => expect(screen.getByTestId('success-msg')).toBeTruthy());
  });
});

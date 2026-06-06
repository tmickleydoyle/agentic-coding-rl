import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../app/page';
import { __reset } from '../lib/store';

beforeEach(() => { __reset(); });

describe('Voting Board Feature', () => {
  it('shows proposals list', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-proposals'));
    await waitFor(() => expect(screen.getByTestId('proposal-row-pr1')).toBeTruthy());
    expect(screen.getByTestId('proposal-row-pr2')).toBeTruthy();
  });

  it('shows scores', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-proposals'));
    await waitFor(() => screen.getByTestId('score-pr2'));
    expect(screen.getByTestId('score-pr2').textContent).toBe('19');
  });

  it('closed proposals have no vote buttons', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-proposals'));
    await waitFor(() => screen.getByTestId('proposal-status-pr3'));
    expect(screen.queryByTestId('upvote-pr3')).toBeNull();
  });

  it('submit form shows error for empty title', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-submit'));
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(screen.getByTestId('form-error')).toBeTruthy();
  });

  it('submit shows success on valid form', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-submit'));
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'New feature' } });
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'A great idea' } });
    fireEvent.change(screen.getByTestId('author-input'), { target: { value: 'dave' } });
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => expect(screen.getByTestId('success-msg')).toBeTruthy());
  });

  it('leaderboard shows top entries', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-leaderboard'));
    await waitFor(() => screen.getByTestId('lb-row-pr2'));
    expect(screen.getByTestId('lb-rank-pr2').textContent).toBe('1');
  });

  it('leaderboard shows at most 5 entries', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-leaderboard'));
    await waitFor(() => screen.getByTestId('leaderboard-page'));
    const rows = screen.getAllByTestId(/^lb-row-/);
    expect(rows.length).toBeLessThanOrEqual(5);
  });
});

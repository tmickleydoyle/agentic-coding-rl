import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../app/page';
import { __reset } from '../lib/store';

beforeEach(() => { __reset(); });

describe('Poll Station Feature', () => {
  it('shows polls list', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-polls'));
    await waitFor(() => expect(screen.getByTestId('poll-row-p1')).toBeTruthy());
    expect(screen.getByTestId('poll-row-p2')).toBeTruthy();
    expect(screen.getByTestId('poll-row-p3')).toBeTruthy();
  });

  it('shows poll status', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-polls'));
    await waitFor(() => screen.getByTestId('poll-status-p3'));
    expect(screen.getByTestId('poll-status-p3').textContent).toBe('closed');
  });

  it('clicking poll navigates to results', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-polls'));
    await waitFor(() => screen.getByTestId('poll-link-p1'));
    fireEvent.click(screen.getByTestId('poll-link-p1'));
    await waitFor(() => expect(screen.getByTestId('results-page')).toBeTruthy());
  });

  it('results page shows question', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-polls'));
    await waitFor(() => screen.getByTestId('poll-link-p1'));
    fireEvent.click(screen.getByTestId('poll-link-p1'));
    await waitFor(() => screen.getByTestId('poll-question'));
    expect(screen.getByTestId('poll-question').textContent).toBe('Favorite color?');
  });

  it('closed poll shows closed badge', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-polls'));
    await waitFor(() => screen.getByTestId('poll-link-p3'));
    fireEvent.click(screen.getByTestId('poll-link-p3'));
    await waitFor(() => screen.getByTestId('closed-badge'));
    expect(screen.getByTestId('closed-badge')).toBeTruthy();
  });

  it('create form shows error on empty submit', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-create'));
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(screen.getByTestId('form-error')).toBeTruthy();
  });

  it('can add more options', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-create'));
    fireEvent.click(screen.getByTestId('add-option-btn'));
    expect(screen.getByTestId('option-input-2')).toBeTruthy();
  });

  it('create shows success after valid submit', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-create'));
    fireEvent.change(screen.getByTestId('question-input'), { target: { value: 'Tea or coffee?' } });
    fireEvent.change(screen.getByTestId('creator-input'), { target: { value: 'dave' } });
    fireEvent.change(screen.getByTestId('option-input-0'), { target: { value: 'Tea' } });
    fireEvent.change(screen.getByTestId('option-input-1'), { target: { value: 'Coffee' } });
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => expect(screen.getByTestId('success-msg')).toBeTruthy());
  });
});

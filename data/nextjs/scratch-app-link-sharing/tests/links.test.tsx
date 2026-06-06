import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../app/page';
import { __reset } from '../lib/store';

beforeEach(() => { __reset(); });

describe('Links Feature', () => {
  it('shows links sorted by upvotes desc', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-links'));
    await waitFor(() => screen.getByTestId('rank-l1'));
    expect(screen.getByTestId('rank-l1').textContent).toBe('1');
    expect(screen.getByTestId('rank-l3').textContent).toBe('2');
    expect(screen.getByTestId('rank-l2').textContent).toBe('3');
  });

  it('shows category badges', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-links'));
    await waitFor(() => screen.getByTestId('link-category-l1'));
    expect(screen.getByTestId('link-category-l1').textContent).toBe('Tech');
  });

  it('clicking link opens detail view', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-links'));
    await waitFor(() => screen.getByTestId('link-title-l1'));
    fireEvent.click(screen.getByTestId('link-title-l1'));
    expect(screen.getByTestId('link-detail')).toBeTruthy();
    expect(screen.getByTestId('link-title').textContent).toBe('OpenAI launches GPT-5');
  });

  it('back button returns to list', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-links'));
    await waitFor(() => screen.getByTestId('link-title-l1'));
    fireEvent.click(screen.getByTestId('link-title-l1'));
    fireEvent.click(screen.getByTestId('back-btn'));
    expect(screen.getByTestId('links-page')).toBeTruthy();
  });

  it('comment error on empty body', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-links'));
    await waitFor(() => screen.getByTestId('link-title-l1'));
    fireEvent.click(screen.getByTestId('link-title-l1'));
    fireEvent.click(screen.getByTestId('comment-submit'));
    expect(screen.getByTestId('comment-error')).toBeTruthy();
  });

  it('submit form shows validation error for missing title', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-submit'));
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(screen.getByTestId('form-error')).toBeTruthy();
  });

  it('submit form shows success after valid submission', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-submit'));
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'My Link' } });
    fireEvent.change(screen.getByTestId('url-input'), { target: { value: 'https://example.com' } });
    fireEvent.change(screen.getByTestId('submitter-input'), { target: { value: 'dave' } });
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => expect(screen.getByTestId('success-msg')).toBeTruthy());
  });
});

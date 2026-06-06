import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../app/page';
import { __reset } from '../lib/store';

beforeEach(() => { __reset(); });

describe('Threads Feature', () => {
  it('shows thread list on threads page', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-threads'));
    await waitFor(() => expect(screen.getByTestId('thread-row-t1')).toBeTruthy());
    expect(screen.getByTestId('thread-row-t2')).toBeTruthy();
    expect(screen.getByTestId('thread-row-t3')).toBeTruthy();
  });

  it('shows category badges', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-threads'));
    await waitFor(() => expect(screen.getByTestId('category-badge-t1')).toBeTruthy());
    expect(screen.getByTestId('category-badge-t1').textContent).toBe('General');
    expect(screen.getByTestId('category-badge-t2').textContent).toBe('Tech');
  });

  it('opens thread detail on click', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-threads'));
    await waitFor(() => screen.getByTestId('thread-link-t1'));
    fireEvent.click(screen.getByTestId('thread-link-t1'));
    expect(screen.getByTestId('thread-detail')).toBeTruthy();
    expect(screen.getByTestId('thread-title').textContent).toBe('Welcome to the Forum');
  });

  it('back button returns to threads list', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-threads'));
    await waitFor(() => screen.getByTestId('thread-link-t1'));
    fireEvent.click(screen.getByTestId('thread-link-t1'));
    fireEvent.click(screen.getByTestId('back-btn'));
    expect(screen.getByTestId('threads-page')).toBeTruthy();
  });

  it('shows reply count per thread', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-threads'));
    await waitFor(() => screen.getByTestId('reply-count-t1'));
    expect(screen.getByTestId('reply-count-t1').textContent).toContain('1');
    expect(screen.getByTestId('reply-count-t2').textContent).toContain('0');
  });

  it('shows validation error when submitting empty new thread', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-new-thread'));
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(screen.getByTestId('form-error')).toBeTruthy();
  });

  it('shows success message after creating thread', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-new-thread'));
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Test Thread' } });
    fireEvent.change(screen.getByTestId('body-input'), { target: { value: 'Test Body' } });
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => expect(screen.getByTestId('success-msg')).toBeTruthy());
  });

  it('shows reply validation error on empty reply', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-threads'));
    await waitFor(() => screen.getByTestId('thread-link-t1'));
    fireEvent.click(screen.getByTestId('thread-link-t1'));
    fireEvent.click(screen.getByTestId('reply-submit'));
    expect(screen.getByTestId('reply-error')).toBeTruthy();
  });
});

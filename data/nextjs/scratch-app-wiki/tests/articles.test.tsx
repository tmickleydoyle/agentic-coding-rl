import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../app/page';
import { __reset } from '../lib/store';

beforeEach(() => { __reset(); });

describe('Wiki Articles Feature', () => {
  it('shows all articles in list', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-articles'));
    await waitFor(() => expect(screen.getByTestId('article-row-a1')).toBeTruthy());
    expect(screen.getByTestId('article-row-a2')).toBeTruthy();
    expect(screen.getByTestId('article-row-a3')).toBeTruthy();
  });

  it('search filters articles by title', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-articles'));
    await waitFor(() => screen.getByTestId('search-input'));
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'TypeScript' } });
    expect(screen.getByTestId('article-row-a2')).toBeTruthy();
    expect(screen.queryByTestId('article-row-a1')).toBeNull();
  });

  it('shows no-results when search has no match', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-articles'));
    await waitFor(() => screen.getByTestId('search-input'));
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'zzznomatch' } });
    expect(screen.getByTestId('no-results')).toBeTruthy();
  });

  it('clicking article navigates to history route', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-articles'));
    await waitFor(() => screen.getByTestId('article-link-a1'));
    fireEvent.click(screen.getByTestId('article-link-a1'));
    expect(screen.getByTestId('history-page')).toBeTruthy();
  });

  it('shows validation error for empty title', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-new-article'));
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(screen.getByTestId('form-error')).toBeTruthy();
  });

  it('shows success after article creation', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-new-article'));
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'New Article' } });
    fireEvent.change(screen.getByTestId('body-input'), { target: { value: 'Some content' } });
    fireEvent.change(screen.getByTestId('author-input'), { target: { value: 'dave' } });
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(() => expect(screen.getByTestId('success-msg')).toBeTruthy());
  });

  it('history page shows revisions', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-articles'));
    await waitFor(() => screen.getByTestId('article-link-a1'));
    fireEvent.click(screen.getByTestId('article-link-a1'));
    await waitFor(() => screen.getByTestId('revision-rev1'));
    expect(screen.getByTestId('revision-editor-rev1').textContent).toBe('alice');
  });
});

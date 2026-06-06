import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Library', () => {
  it('shows seed words', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-library'));
    expect(screen.getByTestId('word-item-w1')).toBeTruthy();
    expect(screen.getByTestId('word-item-w5')).toBeTruthy();
  });

  it('adds a word', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-library'));
    fireEvent.change(screen.getByTestId('word-term-input'), { target: { value: 'Verbose' } });
    fireEvent.change(screen.getByTestId('word-definition-input'), { target: { value: 'Using more words than needed' } });
    fireEvent.click(screen.getByTestId('add-word-btn'));
    expect(screen.getByText('Verbose')).toBeTruthy();
  });

  it('rejects duplicate term', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-library'));
    fireEvent.change(screen.getByTestId('word-term-input'), { target: { value: 'ephemeral' } });
    fireEvent.change(screen.getByTestId('word-definition-input'), { target: { value: 'Some def' } });
    fireEvent.click(screen.getByTestId('add-word-btn'));
    expect(screen.getByTestId('word-error')).toBeTruthy();
  });

  it('rejects empty term', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-library'));
    fireEvent.click(screen.getByTestId('add-word-btn'));
    expect(screen.getByTestId('word-error')).toBeTruthy();
  });

  it('deletes a word', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-library'));
    fireEvent.click(screen.getByTestId('delete-word-w1'));
    expect(screen.queryByTestId('word-item-w1')).toBeNull();
  });

  it('home shows correct word count', () => {
    render(<App />);
    expect(screen.getByTestId('word-count').textContent).toContain('5');
  });

  it('results page shows no-results message initially', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-results'));
    expect(screen.getByTestId('no-results-msg')).toBeTruthy();
  });
});

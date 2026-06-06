import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

beforeEach(() => { cleanup(); });

describe('Home page', () => {
  it('shows active count of 3', () => {
    render(<App />);
    expect(screen.getByTestId('active-count').textContent).toBe('3');
  });

  it('shows recent notes', () => {
    render(<App />);
    expect(screen.getByTestId('recent-notes')).toBeTruthy();
  });
});

describe('Notes page', () => {
  it('lists active notes', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-notes'));
    expect(screen.getByTestId('note-row-n1')).toBeTruthy();
    expect(screen.queryByTestId('note-row-n3')).toBeNull(); // archived
  });

  it('adds a new note', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-notes'));
    fireEvent.change(screen.getByTestId('note-title'), { target: { value: 'Test Note' } });
    fireEvent.click(screen.getByTestId('add-note-btn'));
    expect(screen.getByText(/Test Note/)).toBeTruthy();
  });

  it('rejects empty title', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-notes'));
    fireEvent.click(screen.getByTestId('add-note-btn'));
    expect(screen.getByTestId('note-error')).toBeTruthy();
  });

  it('deletes a note', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-notes'));
    fireEvent.click(screen.getByTestId('delete-note-n1'));
    expect(screen.queryByTestId('note-row-n1')).toBeNull();
  });

  it('archives a note', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-notes'));
    fireEvent.click(screen.getByTestId('archive-note-n1'));
    expect(screen.queryByTestId('note-row-n1')).toBeNull();
  });
});

describe('Tags page', () => {
  it('shows unique tags', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-tags'));
    expect(screen.getByTestId('tag-item-work')).toBeTruthy();
    expect(screen.getByTestId('tag-item-personal')).toBeTruthy();
    expect(screen.getByTestId('tag-item-food')).toBeTruthy();
  });
});

describe('Archive page', () => {
  it('shows archived notes', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-archive'));
    expect(screen.getByTestId('note-row-n3')).toBeTruthy();
  });

  it('unarchives a note', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-archive'));
    fireEvent.click(screen.getByTestId('unarchive-note-n3'));
    expect(screen.queryByTestId('note-row-n3')).toBeNull();
  });
});

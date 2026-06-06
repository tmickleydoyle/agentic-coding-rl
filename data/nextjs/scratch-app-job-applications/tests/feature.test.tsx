import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Dashboard', () => {
  it('shows total applications', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-total').textContent).toBe('2');
  });

  it('shows applied count', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-applied-count').textContent).toBe('1');
  });

  it('shows interview count', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-interview-count').textContent).toBe('1');
  });

  it('shows most recent company', () => {
    render(<App />);
    // Globex appliedDate 2025-10-15 is more recent
    expect(screen.getByTestId('dashboard-recent-company').textContent).toBe('Globex');
  });
});

describe('Applications', () => {
  it('lists seed applications', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-applications'));
    expect(screen.getAllByTestId('app-item').length).toBe(2);
  });

  it('adds a new application', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-applications'));
    fireEvent.change(screen.getByTestId('app-company-input'), { target: { value: 'Initech' } });
    fireEvent.change(screen.getByTestId('app-role-input'), { target: { value: 'Dev' } });
    fireEvent.change(screen.getByTestId('app-date-input'), { target: { value: '2025-11-01' } });
    fireEvent.click(screen.getByTestId('app-submit'));
    expect(screen.getAllByTestId('app-item').length).toBe(3);
  });

  it('does not add without company', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-applications'));
    fireEvent.change(screen.getByTestId('app-role-input'), { target: { value: 'Dev' } });
    fireEvent.change(screen.getByTestId('app-date-input'), { target: { value: '2025-11-01' } });
    fireEvent.click(screen.getByTestId('app-submit'));
    expect(screen.getAllByTestId('app-item').length).toBe(2);
  });

  it('deletes an application', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-applications'));
    fireEvent.click(screen.getAllByTestId('app-delete')[0]);
    expect(screen.getAllByTestId('app-item').length).toBe(1);
  });
});

describe('Contacts', () => {
  it('shows seed contact', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-contacts'));
    expect(screen.getAllByTestId('contact-item').length).toBe(1);
  });

  it('deletes a contact', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-contacts'));
    fireEvent.click(screen.getByTestId('contact-delete'));
    expect(screen.queryAllByTestId('contact-item').length).toBe(0);
  });
});

describe('Notes', () => {
  it('shows seed note', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-notes'));
    expect(screen.getAllByTestId('note-item').length).toBe(1);
  });

  it('deletes a note', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-notes'));
    fireEvent.click(screen.getByTestId('note-delete'));
    expect(screen.queryAllByTestId('note-item').length).toBe(0);
  });
});

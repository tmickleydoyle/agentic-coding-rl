import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Dashboard', () => {
  it('shows pet count', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-pet-count').textContent).toBe('2');
  });

  it('shows active medications count', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-active-meds').textContent).toBe('1');
  });
});

describe('Pets', () => {
  it('lists seed pets', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-pets'));
    expect(screen.getAllByTestId('pet-item').length).toBe(2);
  });

  it('adds a new pet', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-pets'));
    fireEvent.change(screen.getByTestId('pet-name-input'), { target: { value: 'Rex' } });
    fireEvent.click(screen.getByTestId('pet-submit'));
    expect(screen.getAllByTestId('pet-item').length).toBe(3);
  });

  it('does not add pet without name', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-pets'));
    fireEvent.click(screen.getByTestId('pet-submit'));
    expect(screen.getAllByTestId('pet-item').length).toBe(2);
  });

  it('deletes a pet', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-pets'));
    fireEvent.click(screen.getAllByTestId('pet-delete')[0]);
    expect(screen.getAllByTestId('pet-item').length).toBe(1);
  });
});

describe('Visits', () => {
  it('lists seed visit', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-visits'));
    expect(screen.getAllByTestId('visit-item').length).toBe(1);
  });

  it('deletes a visit', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-visits'));
    fireEvent.click(screen.getByTestId('visit-delete'));
    expect(screen.queryAllByTestId('visit-item').length).toBe(0);
  });
});

describe('Medications', () => {
  it('lists seed medications', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-medications'));
    expect(screen.getAllByTestId('med-item').length).toBe(2);
  });

  it('toggles medication active status', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-medications'));
    const firstItem = screen.getAllByTestId('med-item')[0];
    fireEvent.click(firstItem.querySelector('[data-testid="med-toggle"]') as HTMLElement);
    expect(firstItem.textContent).toContain('inactive');
  });

  it('deletes a medication', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-medications'));
    fireEvent.click(screen.getAllByTestId('med-delete')[0]);
    expect(screen.getAllByTestId('med-item').length).toBe(1);
  });
});

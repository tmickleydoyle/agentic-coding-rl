import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

beforeEach(() => { cleanup(); });

function goToExpenses() {
  render(<App />);
  fireEvent.click(screen.getByTestId('nav-expenses'));
}

describe('Expenses page', () => {
  it('shows seed expenses', () => {
    goToExpenses();
    expect(screen.getByTestId('expense-row-e1')).toBeTruthy();
    expect(screen.getByTestId('expense-row-e2')).toBeTruthy();
  });

  it('adds a new expense', () => {
    goToExpenses();
    fireEvent.change(screen.getByTestId('expense-description'), { target: { value: 'Coffee' } });
    fireEvent.change(screen.getByTestId('expense-amount'), { target: { value: '3.5' } });
    fireEvent.click(screen.getByTestId('add-expense-btn'));
    expect(screen.getByText(/Coffee/)).toBeTruthy();
  });

  it('rejects empty description', () => {
    goToExpenses();
    fireEvent.change(screen.getByTestId('expense-amount'), { target: { value: '5' } });
    fireEvent.click(screen.getByTestId('add-expense-btn'));
    expect(screen.getByTestId('expense-error')).toBeTruthy();
  });

  it('rejects zero amount', () => {
    goToExpenses();
    fireEvent.change(screen.getByTestId('expense-description'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByTestId('expense-amount'), { target: { value: '0' } });
    fireEvent.click(screen.getByTestId('add-expense-btn'));
    expect(screen.getByTestId('expense-error')).toBeTruthy();
  });

  it('deletes an expense', () => {
    goToExpenses();
    fireEvent.click(screen.getByTestId('delete-expense-e1'));
    expect(screen.queryByTestId('expense-row-e1')).toBeNull();
  });

  it('displays amounts with 2 decimal places', () => {
    goToExpenses();
    expect(screen.getByText('$45.50')).toBeTruthy();
  });
});

describe('Home page totals', () => {
  it('shows correct total', () => {
    render(<App />);
    const total = screen.getByTestId('total-spent');
    expect(total.textContent).toBe('$103.25');
  });

  it('updates total after delete', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-expenses'));
    fireEvent.click(screen.getByTestId('delete-expense-e1'));
    fireEvent.click(screen.getByTestId('nav-home'));
    const total = screen.getByTestId('total-spent');
    expect(total.textContent).toBe('$57.75');
  });

  it('shows recent expenses list', () => {
    render(<App />);
    expect(screen.getByTestId('recent-expenses')).toBeTruthy();
  });
});

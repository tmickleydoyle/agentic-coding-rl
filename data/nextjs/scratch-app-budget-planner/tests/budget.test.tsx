import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Budget Planner Features', () => {
  it('home shows correct balance from seed data', () => {
    render(<App />);
    // 3000 - 150 - 50 = 2800
    expect(screen.getByTestId('total-balance').textContent).toContain('2800.00');
  });

  it('home shows income and expenses', () => {
    render(<App />);
    expect(screen.getByTestId('total-income').textContent).toContain('3000.00');
    expect(screen.getByTestId('total-expenses').textContent).toContain('-200.00');
  });

  it('transactions page lists seed transactions', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-transactions'));
    expect(screen.getByTestId('tx-item-t1')).toBeTruthy();
    expect(screen.getByTestId('tx-item-t2')).toBeTruthy();
  });

  it('adds a transaction', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-transactions'));
    fireEvent.change(screen.getByTestId('tx-desc-input'), { target: { value: 'Coffee' } });
    fireEvent.change(screen.getByTestId('tx-amount-input'), { target: { value: '-5' } });
    fireEvent.click(screen.getByTestId('add-tx-btn'));
    expect(screen.getByText('Coffee')).toBeTruthy();
  });

  it('rejects transaction with zero amount', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-transactions'));
    fireEvent.change(screen.getByTestId('tx-desc-input'), { target: { value: 'Zero' } });
    fireEvent.change(screen.getByTestId('tx-amount-input'), { target: { value: '0' } });
    fireEvent.click(screen.getByTestId('add-tx-btn'));
    expect(screen.getByTestId('tx-error')).toBeTruthy();
  });

  it('categories page lists seed categories', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-categories'));
    expect(screen.getByTestId('cat-item-cat1')).toBeTruthy();
    expect(screen.getByTestId('cat-item-cat2')).toBeTruthy();
  });

  it('adds a category', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-categories'));
    fireEvent.change(screen.getByTestId('cat-name-input'), { target: { value: 'Entertainment' } });
    fireEvent.click(screen.getByTestId('add-cat-btn'));
    expect(screen.getByText('Entertainment')).toBeTruthy();
  });

  it('deletes a transaction', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-transactions'));
    fireEvent.click(screen.getByTestId('delete-tx-t1'));
    expect(screen.queryByTestId('tx-item-t1')).toBeNull();
  });

  it('summary shows income and balance', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-summary'));
    expect(screen.getByTestId('summary-income').textContent).toContain('3000.00');
    expect(screen.getByTestId('summary-balance').textContent).toContain('2800.00');
  });
});

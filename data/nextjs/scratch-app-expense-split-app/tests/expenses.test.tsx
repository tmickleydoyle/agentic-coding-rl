import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Expense Split Features', () => {
  it('home shows group count and total', () => {
    render(<App />);
    expect(screen.getByTestId('group-count').textContent).toContain('1');
    expect(screen.getByTestId('total-expenses').textContent).toContain('390.00');
  });

  it('lists seed group', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-groups'));
    expect(screen.getByTestId('group-item-g1')).toBeTruthy();
  });

  it('adds a group', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-groups'));
    fireEvent.change(screen.getByTestId('group-name-input'), { target: { value: 'Weekend Trip' } });
    fireEvent.change(screen.getByTestId('group-members-input'), { target: { value: 'Dave, Eve' } });
    fireEvent.click(screen.getByTestId('add-group-btn'));
    expect(screen.getByText('Weekend Trip')).toBeTruthy();
  });

  it('rejects group without members', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-groups'));
    fireEvent.change(screen.getByTestId('group-name-input'), { target: { value: 'Solo' } });
    fireEvent.click(screen.getByTestId('add-group-btn'));
    expect(screen.getByTestId('group-error')).toBeTruthy();
  });

  it('lists seed expenses', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-expenses'));
    expect(screen.getByTestId('expense-item-e1')).toBeTruthy();
    expect(screen.getByTestId('expense-item-e2')).toBeTruthy();
  });

  it('settle shows balances for a group', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-settle'));
    fireEvent.change(screen.getByTestId('settle-group-select'), { target: { value: 'g1' } });
    // Total = 390, fair share = 130 each
    // Alice paid 300, balance = 300 - 130 = 170
    // Bob paid 90, balance = 90 - 130 = -40
    // Carol paid 0, balance = 0 - 130 = -130
    expect(screen.getByTestId('balance-Alice')).toBeTruthy();
    expect(screen.getByTestId('balance-amount-Alice').textContent).toContain('170.00');
  });

  it('settle shows negative balance for non-payer', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-settle'));
    fireEvent.change(screen.getByTestId('settle-group-select'), { target: { value: 'g1' } });
    expect(screen.getByTestId('balance-amount-Carol').textContent).toContain('-130.00');
  });

  it('deletes a group and its expenses', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-groups'));
    fireEvent.click(screen.getByTestId('delete-group-g1'));
    expect(screen.queryByTestId('group-item-g1')).toBeNull();
    fireEvent.click(screen.getByTestId('nav-expenses'));
    expect(screen.queryByTestId('expense-item-e1')).toBeNull();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Stock Watchlist Features', () => {
  it('home shows portfolio value', () => {
    render(<App />);
    // AAPL: 185.50*10=1855, GOOGL: 140.25*5=701.25, total=2556.25
    expect(screen.getByTestId('portfolio-value').textContent).toContain('2556.25');
  });

  it('home shows 1 active alert', () => {
    render(<App />);
    expect(screen.getByTestId('active-alerts').textContent).toContain('1');
  });

  it('lists seed stocks', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-watchlist'));
    expect(screen.getByTestId('stock-item-stk1')).toBeTruthy();
    expect(screen.getByTestId('stock-item-stk2')).toBeTruthy();
  });

  it('adds a stock', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-watchlist'));
    fireEvent.change(screen.getByTestId('stock-ticker-input'), { target: { value: 'msft' } });
    fireEvent.change(screen.getByTestId('stock-name-input'), { target: { value: 'Microsoft' } });
    fireEvent.change(screen.getByTestId('stock-price-input'), { target: { value: '300' } });
    fireEvent.change(screen.getByTestId('stock-quantity-input'), { target: { value: '5' } });
    fireEvent.click(screen.getByTestId('add-stock-btn'));
    expect(screen.getByText('MSFT')).toBeTruthy();
  });

  it('rejects duplicate ticker', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-watchlist'));
    fireEvent.change(screen.getByTestId('stock-ticker-input'), { target: { value: 'AAPL' } });
    fireEvent.change(screen.getByTestId('stock-price-input'), { target: { value: '200' } });
    fireEvent.change(screen.getByTestId('stock-quantity-input'), { target: { value: '1' } });
    fireEvent.click(screen.getByTestId('add-stock-btn'));
    expect(screen.getByTestId('stock-error')).toBeTruthy();
  });

  it('updating price creates history entry', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-watchlist'));
    fireEvent.change(screen.getByTestId('update-price-input-stk1'), { target: { value: '210' } });
    fireEvent.click(screen.getByTestId('update-price-btn-stk1'));
    fireEvent.click(screen.getByTestId('nav-history'));
    expect(screen.queryByTestId('no-history-msg')).toBeNull();
  });

  it('alert triggered when price exceeds target', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-watchlist'));
    fireEvent.change(screen.getByTestId('update-price-input-stk1'), { target: { value: '210' } });
    fireEvent.click(screen.getByTestId('update-price-btn-stk1'));
    fireEvent.click(screen.getByTestId('nav-alerts'));
    expect(screen.getByTestId('alert-triggered-al1').textContent).toContain('Triggered');
  });

  it('deleting a stock removes its alerts', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-watchlist'));
    fireEvent.click(screen.getByTestId('delete-stock-stk1'));
    fireEvent.click(screen.getByTestId('nav-alerts'));
    expect(screen.queryByTestId('alert-item-al1')).toBeNull();
  });
});

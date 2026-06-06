import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Dashboard', () => {
  it('shows total subscription count', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-total-count').textContent).toBe('3');
  });

  it('shows active count', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-active-count').textContent).toBe('2');
  });

  it('shows monthly cost for active subscriptions only', () => {
    render(<App />);
    // Netflix 15.99 + Spotify 9.99 = 25.98
    expect(screen.getByTestId('dashboard-monthly-cost').textContent).toBe('25.98');
  });
});

describe('Subscriptions', () => {
  it('lists seed subscriptions', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-subscriptions'));
    expect(screen.getAllByTestId('sub-item').length).toBe(3);
  });

  it('adds a new subscription', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-subscriptions'));
    fireEvent.change(screen.getByTestId('sub-name-input'), { target: { value: 'Disney+' } });
    fireEvent.change(screen.getByTestId('sub-cost-input'), { target: { value: '7.99' } });
    fireEvent.change(screen.getByTestId('sub-day-input'), { target: { value: '5' } });
    fireEvent.change(screen.getByTestId('sub-category-input'), { target: { value: 'Entertainment' } });
    fireEvent.click(screen.getByTestId('sub-submit'));
    expect(screen.getAllByTestId('sub-item').length).toBe(4);
  });

  it('does not add without name', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-subscriptions'));
    fireEvent.change(screen.getByTestId('sub-cost-input'), { target: { value: '5' } });
    fireEvent.change(screen.getByTestId('sub-day-input'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('sub-category-input'), { target: { value: 'X' } });
    fireEvent.click(screen.getByTestId('sub-submit'));
    expect(screen.getAllByTestId('sub-item').length).toBe(3);
  });

  it('toggles subscription status', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-subscriptions'));
    const toggles = screen.getAllByTestId('sub-toggle');
    fireEvent.click(toggles[0]);
    const items = screen.getAllByTestId('sub-item');
    expect(items[0].textContent).toContain('paused');
  });

  it('deletes a subscription', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-subscriptions'));
    fireEvent.click(screen.getAllByTestId('sub-delete')[0]);
    expect(screen.getAllByTestId('sub-item').length).toBe(2);
  });
});

describe('Calendar', () => {
  it('shows all subscriptions sorted by billing day', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-calendar'));
    const items = screen.getAllByTestId('calendar-item');
    expect(items.length).toBe(3);
    // First item should be billingDay 1 (Netflix)
    expect(items[0].textContent).toContain('1');
  });
});

describe('Stats', () => {
  it('shows correct total monthly cost', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-stats'));
    expect(screen.getByTestId('stats-total-cost').textContent).toBe('25.98');
  });

  it('shows category breakdown', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-stats'));
    const items = screen.getAllByTestId('stats-category-item');
    expect(items.length).toBeGreaterThanOrEqual(2);
  });
});

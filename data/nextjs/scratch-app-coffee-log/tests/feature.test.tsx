import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Dashboard', () => {
  it('shows brew count', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-brew-count').textContent).toBe('3');
  });

  it('shows bean count', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-bean-count').textContent).toBe('2');
  });

  it('shows average rating', () => {
    render(<App />);
    // (5 + 4 + 4) / 3 = 4.3
    expect(screen.getByTestId('dashboard-avg-rating').textContent).toBe('4.3');
  });
});

describe('Brew Log', () => {
  it('lists seed brews', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-log'));
    expect(screen.getAllByTestId('brew-item').length).toBe(3);
  });

  it('deletes a brew', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-log'));
    fireEvent.click(screen.getAllByTestId('brew-delete')[0]);
    expect(screen.getAllByTestId('brew-item').length).toBe(2);
  });
});

describe('Beans', () => {
  it('lists seed beans', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-beans'));
    expect(screen.getAllByTestId('bean-item').length).toBe(2);
  });

  it('adds a new bean', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-beans'));
    fireEvent.change(screen.getByTestId('bean-name-input'), { target: { value: 'Kenya AA' } });
    fireEvent.change(screen.getByTestId('bean-origin-input'), { target: { value: 'Kenya' } });
    fireEvent.click(screen.getByTestId('bean-submit'));
    expect(screen.getAllByTestId('bean-item').length).toBe(3);
  });

  it('does not add bean without origin', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-beans'));
    fireEvent.change(screen.getByTestId('bean-name-input'), { target: { value: 'Mystery Bean' } });
    fireEvent.click(screen.getByTestId('bean-submit'));
    expect(screen.getAllByTestId('bean-item').length).toBe(2);
  });

  it('deletes a bean and its brews', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-beans'));
    // Delete first bean (b1) which has 2 brews
    fireEvent.click(screen.getAllByTestId('bean-delete')[0]);
    expect(screen.getAllByTestId('bean-item').length).toBe(1);
    // Check brews are removed
    fireEvent.click(screen.getByTestId('nav-log'));
    expect(screen.getAllByTestId('brew-item').length).toBe(1);
  });
});

describe('Stats', () => {
  it('shows method breakdown', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-stats'));
    const items = screen.getAllByTestId('stats-method-item');
    expect(items.length).toBeGreaterThanOrEqual(2);
  });

  it('shows bean rating averages', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-stats'));
    const items = screen.getAllByTestId('stats-bean-rating-item');
    expect(items.length).toBeGreaterThanOrEqual(2);
  });
});

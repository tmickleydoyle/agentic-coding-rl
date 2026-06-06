import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Weather Log Features', () => {
  it('home shows total entries', () => {
    render(<App />);
    expect(screen.getByTestId('total-entries').textContent).toContain('3');
  });

  it('home shows average temp', () => {
    render(<App />);
    // (22+15+8)/3 = 15
    expect(screen.getByTestId('avg-temp').textContent).toContain('15');
  });

  it('home shows hottest day', () => {
    render(<App />);
    expect(screen.getByTestId('hottest-day').textContent).toContain('2024-01-01');
  });

  it('home shows coldest day', () => {
    render(<App />);
    expect(screen.getByTestId('coldest-day').textContent).toContain('2024-01-03');
  });

  it('log page shows seed entries', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-log'));
    expect(screen.getByTestId('entry-item-w1')).toBeTruthy();
    expect(screen.getByTestId('entry-item-w3')).toBeTruthy();
  });

  it('adds a weather entry', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-log'));
    fireEvent.change(screen.getByTestId('entry-date-input'), { target: { value: '2024-01-04' } });
    fireEvent.change(screen.getByTestId('entry-temp-input'), { target: { value: '20' } });
    fireEvent.change(screen.getByTestId('entry-humidity-input'), { target: { value: '50' } });
    fireEvent.click(screen.getByTestId('add-entry-btn'));
    expect(screen.queryByTestId('entry-error')).toBeNull();
  });

  it('rejects duplicate date', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-log'));
    fireEvent.change(screen.getByTestId('entry-date-input'), { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getByTestId('entry-temp-input'), { target: { value: '25' } });
    fireEvent.change(screen.getByTestId('entry-humidity-input'), { target: { value: '50' } });
    fireEvent.click(screen.getByTestId('add-entry-btn'));
    expect(screen.getByTestId('entry-error')).toBeTruthy();
  });

  it('settings changes unit', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-settings'));
    fireEvent.change(screen.getByTestId('unit-select'), { target: { value: 'fahrenheit' } });
    fireEvent.click(screen.getByTestId('save-settings-btn'));
    expect(screen.getByTestId('current-unit').textContent).toContain('fahrenheit');
  });

  it('charts shows min and max temp', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-charts'));
    expect(screen.getByTestId('min-temp').textContent).toContain('8');
    expect(screen.getByTestId('max-temp').textContent).toContain('22');
  });
});

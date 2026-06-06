import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Dashboard', () => {
  it('shows plant count', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-plant-count').textContent).toBe('3');
  });

  it('shows bed count', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-bed-count').textContent).toBe('2');
  });
});

describe('Plants', () => {
  it('lists seed plants', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-plants'));
    expect(screen.getAllByTestId('plant-item').length).toBe(3);
  });

  it('adds a new plant', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-plants'));
    fireEvent.change(screen.getByTestId('plant-name-input'), { target: { value: 'Rose' } });
    fireEvent.click(screen.getByTestId('plant-submit'));
    expect(screen.getAllByTestId('plant-item').length).toBe(4);
  });

  it('does not add plant with empty name', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-plants'));
    fireEvent.click(screen.getByTestId('plant-submit'));
    expect(screen.getAllByTestId('plant-item').length).toBe(3);
  });

  it('deletes a plant', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-plants'));
    fireEvent.click(screen.getAllByTestId('plant-delete')[0]);
    expect(screen.getAllByTestId('plant-item').length).toBe(2);
  });
});

describe('Beds', () => {
  it('lists seed beds', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-beds'));
    expect(screen.getAllByTestId('bed-item').length).toBe(2);
  });

  it('shows plant count per bed', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-beds'));
    const counts = screen.getAllByTestId('bed-plant-count');
    expect(counts[0].textContent).toBe('2');
    expect(counts[1].textContent).toBe('0');
  });

  it('adds a new bed', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-beds'));
    fireEvent.change(screen.getByTestId('bed-name-input'), { target: { value: 'New Bed' } });
    fireEvent.change(screen.getByTestId('bed-size-input'), { target: { value: '12' } });
    fireEvent.click(screen.getByTestId('bed-submit'));
    expect(screen.getAllByTestId('bed-item').length).toBe(3);
  });

  it('deletes a bed', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-beds'));
    fireEvent.click(screen.getAllByTestId('bed-delete')[0]);
    expect(screen.getAllByTestId('bed-item').length).toBe(1);
  });
});

describe('Log', () => {
  it('shows seed log entry', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-log'));
    expect(screen.getAllByTestId('log-item').length).toBe(1);
  });

  it('deletes a log entry', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-log'));
    fireEvent.click(screen.getByTestId('log-delete'));
    expect(screen.queryAllByTestId('log-item').length).toBe(0);
  });
});

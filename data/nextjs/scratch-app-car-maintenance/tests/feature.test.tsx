import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Dashboard', () => {
  it('shows vehicle count', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-vehicle-count').textContent).toBe('2');
  });

  it('shows service record count', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-service-count').textContent).toBe('2');
  });

  it('shows overdue reminders (r2 is overdue)', () => {
    render(<App />);
    // r2 dueDate 2025-06-01 is in the past
    const count = Number(screen.getByTestId('dashboard-overdue-count').textContent);
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

describe('Vehicles', () => {
  it('lists seed vehicles', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-vehicles'));
    expect(screen.getAllByTestId('vehicle-item').length).toBe(2);
  });

  it('adds a new vehicle', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-vehicles'));
    fireEvent.change(screen.getByTestId('vehicle-make-input'), { target: { value: 'Ford' } });
    fireEvent.change(screen.getByTestId('vehicle-model-input'), { target: { value: 'Focus' } });
    fireEvent.change(screen.getByTestId('vehicle-year-input'), { target: { value: '2019' } });
    fireEvent.click(screen.getByTestId('vehicle-submit'));
    expect(screen.getAllByTestId('vehicle-item').length).toBe(3);
  });

  it('does not add without make', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-vehicles'));
    fireEvent.change(screen.getByTestId('vehicle-model-input'), { target: { value: 'Focus' } });
    fireEvent.change(screen.getByTestId('vehicle-year-input'), { target: { value: '2019' } });
    fireEvent.click(screen.getByTestId('vehicle-submit'));
    expect(screen.getAllByTestId('vehicle-item').length).toBe(2);
  });

  it('deletes a vehicle', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-vehicles'));
    fireEvent.click(screen.getAllByTestId('vehicle-delete')[0]);
    expect(screen.getAllByTestId('vehicle-item').length).toBe(1);
  });
});

describe('Service Records', () => {
  it('lists seed service records', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-service'));
    expect(screen.getAllByTestId('service-item').length).toBe(2);
  });

  it('deletes a service record', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-service'));
    fireEvent.click(screen.getAllByTestId('service-delete')[0]);
    expect(screen.getAllByTestId('service-item').length).toBe(1);
  });
});

describe('Reminders', () => {
  it('lists seed reminders', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-reminders'));
    expect(screen.getAllByTestId('reminder-item').length).toBe(2);
  });

  it('toggles reminder completed', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-reminders'));
    fireEvent.click(screen.getAllByTestId('reminder-toggle')[0]);
    const firstItem = screen.getAllByTestId('reminder-item')[0];
    expect(firstItem.textContent).toContain('done');
  });

  it('deletes a reminder', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-reminders'));
    fireEvent.click(screen.getAllByTestId('reminder-delete')[0]);
    expect(screen.getAllByTestId('reminder-item').length).toBe(1);
  });
});

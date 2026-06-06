import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Navigation', () => {
  it('renders all nav links', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-vehicles')).toBeTruthy();
    expect(screen.getByTestId('nav-service')).toBeTruthy();
    expect(screen.getByTestId('nav-reminders')).toBeTruthy();
  });

  it('home active by default', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home').getAttribute('data-active')).toBe('true');
  });

  it('navigates to vehicles', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-vehicles'));
    expect(screen.getByTestId('vehicle-list')).toBeTruthy();
    expect(screen.getByTestId('nav-vehicles').getAttribute('data-active')).toBe('true');
  });

  it('navigates to service', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-service'));
    expect(screen.getByTestId('service-list')).toBeTruthy();
  });

  it('navigates to reminders', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-reminders'));
    expect(screen.getByTestId('reminder-list')).toBeTruthy();
  });
});

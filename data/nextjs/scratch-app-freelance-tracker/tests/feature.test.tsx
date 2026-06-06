import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Dashboard', () => {
  it('shows correct client count', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-clients-count').textContent).toBe('2');
  });

  it('shows correct project count', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-projects-count').textContent).toBe('2');
  });

  it('shows unpaid invoice total', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-unpaid-total').textContent).toBe('1000');
  });
});

describe('Clients', () => {
  it('lists seed clients', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-clients'));
    const items = screen.getAllByTestId('client-item');
    expect(items.length).toBe(2);
  });

  it('adds a new client', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-clients'));
    fireEvent.change(screen.getByTestId('client-name-input'), { target: { value: 'New Client' } });
    fireEvent.change(screen.getByTestId('client-email-input'), { target: { value: 'new@example.com' } });
    fireEvent.click(screen.getByTestId('client-submit'));
    expect(screen.getAllByTestId('client-item').length).toBe(3);
  });

  it('does not add client with empty name', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-clients'));
    fireEvent.change(screen.getByTestId('client-email-input'), { target: { value: 'x@x.com' } });
    fireEvent.click(screen.getByTestId('client-submit'));
    expect(screen.getAllByTestId('client-item').length).toBe(2);
  });

  it('deletes a client', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-clients'));
    fireEvent.click(screen.getAllByTestId('client-delete')[0]);
    expect(screen.getAllByTestId('client-item').length).toBe(1);
  });
});

describe('Projects', () => {
  it('lists seed projects', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-projects'));
    expect(screen.getAllByTestId('project-item').length).toBe(2);
  });

  it('toggles project status', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-projects'));
    const firstItem = screen.getAllByTestId('project-item')[0];
    const toggle = firstItem.querySelector('[data-testid="project-status-toggle"]') as HTMLElement;
    fireEvent.click(toggle);
    expect(firstItem.textContent).toContain('completed');
  });

  it('deletes a project', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-projects'));
    fireEvent.click(screen.getAllByTestId('project-delete')[0]);
    expect(screen.getAllByTestId('project-item').length).toBe(1);
  });
});

describe('Invoices', () => {
  it('lists seed invoices', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-invoices'));
    expect(screen.getAllByTestId('invoice-item').length).toBe(2);
  });

  it('marks invoice paid', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-invoices'));
    fireEvent.click(screen.getAllByTestId('invoice-pay')[0]);
    expect(screen.queryAllByTestId('invoice-pay').length).toBe(0);
  });

  it('deletes an invoice', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-invoices'));
    fireEvent.click(screen.getAllByTestId('invoice-delete')[0]);
    expect(screen.getAllByTestId('invoice-item').length).toBe(1);
  });
});

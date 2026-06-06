import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

beforeEach(() => { cleanup(); });

describe('Home page', () => {
  it('shows contact count of 4', () => {
    render(<App />);
    expect(screen.getByTestId('contact-count').textContent).toBe('4');
  });
});

describe('Contacts page', () => {
  it('lists all seed contacts', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-contacts'));
    expect(screen.getByTestId('contact-row-ct1')).toBeTruthy();
    expect(screen.getByTestId('contact-row-ct2')).toBeTruthy();
  });

  it('adds a valid contact', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-contacts'));
    fireEvent.change(screen.getByTestId('contact-name'), { target: { value: 'Eve Davis' } });
    fireEvent.change(screen.getByTestId('contact-email'), { target: { value: 'eve@test.com' } });
    fireEvent.click(screen.getByTestId('add-contact-btn'));
    expect(screen.getByText(/Eve Davis/)).toBeTruthy();
  });

  it('rejects empty name', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-contacts'));
    fireEvent.change(screen.getByTestId('contact-email'), { target: { value: 'test@x.com' } });
    fireEvent.click(screen.getByTestId('add-contact-btn'));
    expect(screen.getByTestId('contact-error')).toBeTruthy();
  });

  it('rejects invalid email', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-contacts'));
    fireEvent.change(screen.getByTestId('contact-name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByTestId('contact-email'), { target: { value: 'notanemail' } });
    fireEvent.click(screen.getByTestId('add-contact-btn'));
    expect(screen.getByTestId('contact-error')).toBeTruthy();
  });

  it('deletes a contact', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-contacts'));
    fireEvent.click(screen.getByTestId('delete-contact-ct1'));
    expect(screen.queryByTestId('contact-row-ct1')).toBeNull();
  });
});

describe('Groups page', () => {
  it('shows seed groups', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-groups'));
    expect(screen.getByTestId('group-row-g1')).toBeTruthy();
    expect(screen.getByTestId('group-row-g2')).toBeTruthy();
  });

  it('adds a new group', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-groups'));
    fireEvent.change(screen.getByTestId('group-name'), { target: { value: 'Neighbors' } });
    fireEvent.click(screen.getByTestId('add-group-btn'));
    expect(screen.getByText(/Neighbors/)).toBeTruthy();
  });

  it('rejects duplicate group name', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-groups'));
    fireEvent.change(screen.getByTestId('group-name'), { target: { value: 'Friends' } });
    fireEvent.click(screen.getByTestId('add-group-btn'));
    expect(screen.getByTestId('group-error')).toBeTruthy();
  });
});

describe('Search page', () => {
  it('shows all contacts when empty', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-search'));
    expect(screen.getAllByTestId(/^contact-row-/).length).toBe(4);
  });

  it('filters by name', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-search'));
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'alice' } });
    expect(screen.getAllByTestId(/^contact-row-/).length).toBe(1);
  });

  it('filters by email', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-search'));
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'bob@example' } });
    expect(screen.getByTestId('contact-row-ct2')).toBeTruthy();
  });
});

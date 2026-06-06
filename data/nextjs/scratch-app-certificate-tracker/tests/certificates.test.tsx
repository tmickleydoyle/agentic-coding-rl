import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Home Page', () => {
  it('shows app title', () => {
    render(<App />);
    expect(screen.getByTestId('app-title').textContent).toBe('Certificate Tracker');
  });

  it('shows certificate and skill counts', () => {
    render(<App />);
    expect(screen.getByTestId('total-certificates').textContent).toContain('2');
    expect(screen.getByTestId('total-skills').textContent).toContain('4');
  });
});

describe('Certificates Page', () => {
  it('lists seed certificates', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-certificates'));
    expect(screen.getByTestId('cert-recipient-1').textContent).toBe('Alice Johnson');
    expect(screen.getByTestId('cert-skill-1').textContent).toBe('JavaScript');
  });

  it('toggles issue form', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-certificates'));
    expect(screen.queryByTestId('cert-form')).toBeNull();
    fireEvent.click(screen.getByTestId('issue-cert-btn'));
    expect(screen.getByTestId('cert-form')).toBeTruthy();
  });
});

describe('Skills Page', () => {
  it('lists seed skills', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-skills'));
    expect(screen.getByTestId('skill-name-1').textContent).toBe('JavaScript');
    expect(screen.getByTestId('skill-category-1').textContent).toBe('Programming');
  });

  it('does not show delete for skills with certs', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-skills'));
    // skill 1 has certificates, no delete button
    expect(screen.queryByTestId('delete-skill-1')).toBeNull();
    // skill 4 has no certificates
    expect(screen.getByTestId('delete-skill-4')).toBeTruthy();
  });
});

describe('Issued Page', () => {
  it('shows cert counts per skill', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-issued'));
    expect(screen.getByTestId('issued-count-1').textContent).toBe('1');
    expect(screen.getByTestId('issued-count-2').textContent).toBe('0');
  });

  it('shows unique recipients', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-issued'));
    expect(screen.getByTestId('unique-recipients').textContent).toContain('2');
  });
});

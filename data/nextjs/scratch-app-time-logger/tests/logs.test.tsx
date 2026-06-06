import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

beforeEach(() => { cleanup(); });

describe('Home page', () => {
  it('shows total hours 10.5', () => {
    render(<App />);
    expect(screen.getByTestId('total-hours').textContent).toBe('10.5');
  });

  it('shows project count 3', () => {
    render(<App />);
    expect(screen.getByTestId('project-count').textContent).toBe('3');
  });

  it('shows recent logs', () => {
    render(<App />);
    expect(screen.getByTestId('recent-logs')).toBeTruthy();
  });
});

describe('Logs page', () => {
  it('shows seed log entries', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-logs'));
    expect(screen.getByTestId('log-row-te1')).toBeTruthy();
    expect(screen.getByTestId('log-row-te2')).toBeTruthy();
  });

  it('adds a log entry', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-logs'));
    fireEvent.change(screen.getByTestId('log-description'), { target: { value: 'Testing' } });
    fireEvent.change(screen.getByTestId('log-hours'), { target: { value: '2' } });
    fireEvent.click(screen.getByTestId('add-log-btn'));
    expect(screen.getByText(/Testing/)).toBeTruthy();
  });

  it('rejects empty description', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-logs'));
    fireEvent.change(screen.getByTestId('log-hours'), { target: { value: '1' } });
    fireEvent.click(screen.getByTestId('add-log-btn'));
    expect(screen.getByTestId('log-error')).toBeTruthy();
  });

  it('rejects zero hours', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-logs'));
    fireEvent.change(screen.getByTestId('log-description'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByTestId('log-hours'), { target: { value: '0' } });
    fireEvent.click(screen.getByTestId('add-log-btn'));
    expect(screen.getByTestId('log-error')).toBeTruthy();
  });

  it('deletes a log entry', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-logs'));
    fireEvent.click(screen.getByTestId('delete-log-te1'));
    expect(screen.queryByTestId('log-row-te1')).toBeNull();
  });
});

describe('Projects page', () => {
  it('shows seed projects', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-projects'));
    expect(screen.getByTestId('project-row-p1')).toBeTruthy();
    expect(screen.getByTestId('project-row-p2')).toBeTruthy();
  });

  it('adds a project', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-projects'));
    fireEvent.change(screen.getByTestId('project-name'), { target: { value: 'New Project' } });
    fireEvent.click(screen.getByTestId('add-project-btn'));
    expect(screen.getByText(/New Project/)).toBeTruthy();
  });

  it('rejects duplicate project', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-projects'));
    fireEvent.change(screen.getByTestId('project-name'), { target: { value: 'Mobile App' } });
    fireEvent.click(screen.getByTestId('add-project-btn'));
    expect(screen.getByTestId('project-error')).toBeTruthy();
  });
});

describe('Report page', () => {
  it('shows all projects in report', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-report'));
    expect(screen.getByTestId('report-row-p1')).toBeTruthy();
    expect(screen.getByTestId('report-row-p2')).toBeTruthy();
    expect(screen.getByTestId('report-row-p3')).toBeTruthy();
  });
});

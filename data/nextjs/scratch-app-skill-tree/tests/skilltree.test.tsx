import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Home Page', () => {
  it('shows app title', () => {
    render(<App />);
    expect(screen.getByTestId('app-title').textContent).toBe('Skill Tree');
  });

  it('shows completed and in-progress counts', () => {
    render(<App />);
    expect(screen.getByTestId('completed-count').textContent).toContain('2');
    expect(screen.getByTestId('inprogress-count').textContent).toContain('1');
  });
});

describe('Skills Page', () => {
  it('lists all skills', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-skills'));
    expect(screen.getByTestId('skill-name-1').textContent).toBe('HTML Basics');
    expect(screen.getByTestId('skill-status-1').textContent).toBe('completed');
  });

  it('shows level badge', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-skills'));
    expect(screen.getByTestId('skill-level-1').textContent).toContain('1');
  });

  it('shows Start button for available skills', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-skills'));
    expect(screen.getByTestId('start-skill-6')).toBeTruthy();
    expect(screen.queryByTestId('start-skill-1')).toBeNull();
  });

  it('shows Complete button for in-progress skills', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-skills'));
    expect(screen.getByTestId('complete-skill-3')).toBeTruthy();
  });
});

describe('Paths Page', () => {
  it('lists learning paths', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-paths'));
    expect(screen.getByTestId('path-name-1').textContent).toBe('Frontend Developer');
    expect(screen.getByTestId('path-count-1').textContent).toContain('4');
  });

  it('shows completion percentage', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-paths'));
    // Frontend: 2 completed / 4 = 50%
    expect(screen.getByTestId('path-completion-1').textContent).toContain('50');
  });
});

describe('Progress Page', () => {
  it('shows overall percentage', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-progress'));
    // 2 completed / 6 total = 33%
    expect(screen.getByTestId('overall-pct').textContent).toContain('33');
  });

  it('shows completed skills', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-progress'));
    expect(screen.getByTestId('completed-skill-1')).toBeTruthy();
    expect(screen.getByTestId('completed-skill-2')).toBeTruthy();
  });

  it('shows in-progress skills', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-progress'));
    expect(screen.getByTestId('inprogress-skill-3')).toBeTruthy();
  });
});

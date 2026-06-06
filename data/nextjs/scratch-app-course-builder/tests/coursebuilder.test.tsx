import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Home Page', () => {
  it('shows course title and description', () => {
    render(<App />);
    expect(screen.getByTestId('course-title').textContent).toBe('Introduction to Programming');
    expect(screen.getByTestId('course-description').textContent).toContain('basics');
  });

  it('shows module and lesson counts', () => {
    render(<App />);
    expect(screen.getByTestId('module-count').textContent).toContain('2');
    expect(screen.getByTestId('lesson-count').textContent).toContain('3');
  });

  it('shows Draft badge by default', () => {
    render(<App />);
    expect(screen.getByTestId('publish-badge').textContent).toBe('Draft');
  });
});

describe('Modules Page', () => {
  it('lists seed modules', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-modules'));
    expect(screen.getByTestId('module-title-1').textContent).toBe('Getting Started');
    expect(screen.getByTestId('module-title-2').textContent).toBe('Variables & Types');
  });

  it('shows module order', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-modules'));
    expect(screen.getByTestId('module-order-1').textContent).toContain('1');
  });
});

describe('Lessons Page', () => {
  it('lists seed lessons', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-lessons'));
    expect(screen.getByTestId('lesson-title-1').textContent).toBe('What is Programming?');
    expect(screen.getByTestId('lesson-type-1').textContent).toBe('video');
    expect(screen.getByTestId('lesson-duration-1').textContent).toBe('10');
  });
});

describe('Preview Page', () => {
  it('shows total duration', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-preview'));
    // 10+20+15 = 45 min
    expect(screen.getByTestId('total-duration').textContent).toContain('45');
  });

  it('shows modules in order with nested lessons', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-preview'));
    expect(screen.getByTestId('preview-module-title-1').textContent).toBe('Getting Started');
    expect(screen.getByTestId('preview-lesson-title-1').textContent).toBe('What is Programming?');
  });
});

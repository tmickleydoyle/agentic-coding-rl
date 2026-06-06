import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../app/page';

describe('Wiki Navigation', () => {
  it('renders navbar with all links', () => {
    render(<App />);
    expect(screen.getByTestId('nav-home')).toBeTruthy();
    expect(screen.getByTestId('nav-articles')).toBeTruthy();
    expect(screen.getByTestId('nav-new-article')).toBeTruthy();
  });

  it('shows home page by default', () => {
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });

  it('navigates to articles page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-articles'));
    expect(screen.getByTestId('articles-page')).toBeTruthy();
  });

  it('navigates to new-article page', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-new-article'));
    expect(screen.getByTestId('new-article-page')).toBeTruthy();
  });

  it('navigates back home', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-articles'));
    fireEvent.click(screen.getByTestId('nav-home'));
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });
});

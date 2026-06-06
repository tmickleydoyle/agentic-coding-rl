import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../reference/app/page';

describe('Meal Planner Features', () => {
  it('home shows 2 seed recipes', () => {
    render(<App />);
    expect(screen.getByTestId('recipe-count').textContent).toContain('2');
  });

  it('home shows 0 planned meals initially', () => {
    render(<App />);
    expect(screen.getByTestId('planned-meals').textContent).toContain('0');
  });

  it('lists seed recipes', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-recipes'));
    expect(screen.getByTestId('recipe-item-rc1')).toBeTruthy();
    expect(screen.getByTestId('recipe-item-rc2')).toBeTruthy();
  });

  it('adds a recipe', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-recipes'));
    fireEvent.change(screen.getByTestId('recipe-name-input'), { target: { value: 'Salad' } });
    fireEvent.change(screen.getByTestId('recipe-ingredients-input'), { target: { value: 'lettuce, tomato' } });
    fireEvent.click(screen.getByTestId('add-recipe-btn'));
    expect(screen.getByText('Salad')).toBeTruthy();
  });

  it('rejects recipe with empty ingredients', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-recipes'));
    fireEvent.change(screen.getByTestId('recipe-name-input'), { target: { value: 'Empty' } });
    fireEvent.click(screen.getByTestId('add-recipe-btn'));
    expect(screen.getByTestId('recipe-error')).toBeTruthy();
  });

  it('plans a meal', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-planner'));
    fireEvent.change(screen.getByTestId('plan-recipe-select'), { target: { value: 'rc1' } });
    fireEvent.click(screen.getByTestId('add-plan-btn'));
    expect(screen.getByTestId('plan-list').children.length).toBe(1);
  });

  it('shopping shows ingredients from plan', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-planner'));
    fireEvent.change(screen.getByTestId('plan-recipe-select'), { target: { value: 'rc1' } });
    fireEvent.click(screen.getByTestId('add-plan-btn'));
    fireEvent.click(screen.getByTestId('nav-shopping'));
    expect(screen.queryByTestId('no-ingredients-msg')).toBeNull();
    // rc1 has oats, milk, honey
    expect(screen.getByTestId('auto-ingredient-0')).toBeTruthy();
  });

  it('shopping shows no-ingredients message when no plan', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-shopping'));
    expect(screen.getByTestId('no-ingredients-msg')).toBeTruthy();
  });

  it('can add custom shopping item', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-shopping'));
    fireEvent.change(screen.getByTestId('custom-item-input'), { target: { value: 'Olive oil' } });
    fireEvent.click(screen.getByTestId('add-custom-btn'));
    expect(screen.getByText('Olive oil')).toBeTruthy();
  });

  it('deleting a recipe removes it from planner', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-planner'));
    fireEvent.change(screen.getByTestId('plan-recipe-select'), { target: { value: 'rc1' } });
    fireEvent.click(screen.getByTestId('add-plan-btn'));
    fireEvent.click(screen.getByTestId('nav-recipes'));
    fireEvent.click(screen.getByTestId('delete-recipe-rc1'));
    fireEvent.click(screen.getByTestId('nav-planner'));
    expect(screen.getByTestId('plan-list').children.length).toBe(0);
  });
});

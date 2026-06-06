import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Recipes Feature', () => {
  it('shows total recipe count on home', () => {
    render(<App />)
    expect(screen.getByTestId('total-recipes').textContent).toBe('3')
  })

  it('shows total favorites count on home', () => {
    render(<App />)
    // r1 and r3 are favorites
    expect(screen.getByTestId('total-favorites').textContent).toBe('2')
  })

  it('shows most recent recipe on home', () => {
    render(<App />)
    // r3 Avocado Toast has latest createdAt
    expect(screen.getByTestId('recent-recipe').textContent).toBe('Avocado Toast')
  })

  it('renders seed recipe cards', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-recipes'))
    expect(screen.getByTestId('recipe-card-r1')).toBeTruthy()
    expect(screen.getByTestId('recipe-card-r2')).toBeTruthy()
    expect(screen.getByTestId('recipe-card-r3')).toBeTruthy()
  })

  it('shows ingredient count on recipe card', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-recipes'))
    expect(screen.getByTestId('recipe-card-r1').textContent).toContain('3 ingredients')
  })

  it('adds a new recipe', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-recipes'))
    fireEvent.change(screen.getByTestId('input-recipe-name'), { target: { value: 'Omelette' } })
    fireEvent.change(screen.getByTestId('input-recipe-description'), { target: { value: 'Quick breakfast' } })
    fireEvent.change(screen.getByTestId('input-recipe-ingredients'), { target: { value: 'eggs, butter' } })
    fireEvent.click(screen.getByTestId('add-recipe-btn'))
    expect(screen.getByText('Omelette')).toBeTruthy()
  })

  it('toggles favorite status', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-recipes'))
    // r2 is not favorite; toggle it
    fireEvent.click(screen.getByTestId('toggle-fav-r2'))
    // check home reflects new count
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('total-favorites').textContent).toBe('3')
  })

  it('shows favorites on favorites page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('fav-card-r1')).toBeTruthy()
    expect(screen.getByTestId('fav-card-r3')).toBeTruthy()
  })

  it('adds ingredient', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-ingredients'))
    fireEvent.change(screen.getByTestId('input-ingredient-name'), { target: { value: 'flour' } })
    fireEvent.change(screen.getByTestId('input-ingredient-quantity'), { target: { value: '1kg' } })
    fireEvent.click(screen.getByTestId('add-ingredient-btn'))
    expect(screen.getByText('flour')).toBeTruthy()
  })

  it('seed ingredients shown', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-ingredients'))
    expect(screen.getByTestId('ingredient-item-i1')).toBeTruthy()
    expect(screen.getByTestId('ingredient-item-i2')).toBeTruthy()
  })
})

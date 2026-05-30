import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add meal flow', () => {
  it('blocks submitting with an empty name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-meal'))
    await user.type(screen.getByTestId('calories-input'), '200')
    await user.click(screen.getByTestId('submit-meal'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add-meal')).toBeInTheDocument()
  })

  it('blocks submitting with invalid calories', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-meal'))
    await user.type(screen.getByTestId('name-input'), 'Banana')
    await user.click(screen.getByTestId('submit-meal'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add-meal')).toBeInTheDocument()
  })

  it('adds a meal and lands on today where it appears', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-meal'))
    await user.type(screen.getByTestId('name-input'), 'Protein shake')
    await user.type(screen.getByTestId('calories-input'), '180')
    await user.type(screen.getByTestId('protein-input'), '30')
    await user.click(screen.getByTestId('submit-meal'))
    expect(screen.getByTestId('page-today')).toBeInTheDocument()
    expect(within(screen.getByTestId('meal-list')).getByText('Protein shake')).toBeInTheDocument()
  })

  it('updates the calorie total after adding a meal', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-meal'))
    await user.type(screen.getByTestId('name-input'), 'Snack')
    await user.type(screen.getByTestId('calories-input'), '230')
    await user.click(screen.getByTestId('submit-meal'))
    // 770 + 230 = 1000
    expect(screen.getByTestId('calorie-total-value')).toHaveTextContent('1000')
  })
})

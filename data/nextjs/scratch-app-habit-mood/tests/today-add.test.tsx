import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('today and add flow', () => {
  it('shows today as not logged before any entry', () => {
    render(<App />)
    expect(screen.getByTestId('today-date')).toHaveTextContent('2026-05-28')
    expect(screen.getByTestId('today-logged')).toHaveAttribute('data-logged', 'false')
    expect(screen.getByTestId('today-score')).toHaveTextContent('-')
  })

  it('blocks logging an out-of-range score', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('score-input'), '7')
    await user.click(screen.getByTestId('submit-mood'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('blocks logging a non-numeric score', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('score-input'), 'abc')
    await user.click(screen.getByTestId('submit-mood'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('logs a mood for today with triggers and navigates back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('score-input'), '4')
    await user.type(screen.getByTestId('triggers-input'), 'coffee, walk')
    await user.click(screen.getByTestId('submit-mood'))
    expect(screen.getByTestId('page-today')).toBeInTheDocument()
    expect(screen.getByTestId('today-logged')).toHaveAttribute('data-logged', 'true')
    expect(screen.getByTestId('today-score')).toHaveTextContent('4')
    expect(screen.getByTestId('today-triggers')).toHaveTextContent('coffee, walk')
  })

  it('logging today adds an entry to history without duplicating', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('score-input'), '3')
    await user.click(screen.getByTestId('submit-mood'))
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('score-input'), '5')
    await user.click(screen.getByTestId('submit-mood'))
    await user.click(screen.getByTestId('nav-history'))
    // 3 seed + 1 upserted today => 4 rows
    expect(screen.getByTestId('entry-list').querySelectorAll('li').length).toBe(4)
    expect(screen.getByTestId('entry-m4-score')).toHaveTextContent('5')
  })

  it('drops empty trigger fragments', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('score-input'), '4')
    await user.type(screen.getByTestId('triggers-input'), 'a,, b ,')
    await user.click(screen.getByTestId('submit-mood'))
    expect(screen.getByTestId('today-triggers')).toHaveTextContent('a, b')
  })
})

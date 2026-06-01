import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('create flow', () => {
  it('blocks creating an event with a blank title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.click(screen.getByTestId('submit-create'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-create')).toBeInTheDocument()
  })

  it('blocks creating an event with an out-of-range day', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('title-input'), 'Party')
    await user.clear(screen.getByTestId('day-input'))
    await user.type(screen.getByTestId('day-input'), '40')
    await user.click(screen.getByTestId('submit-create'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('creates an event and shows it on its day', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('title-input'), 'Party')
    await user.clear(screen.getByTestId('day-input'))
    await user.type(screen.getByTestId('day-input'), '20')
    await user.selectOptions(screen.getByTestId('category-select'), 'social')
    await user.click(screen.getByTestId('submit-create'))
    expect(screen.getByTestId('page-month')).toBeInTheDocument()
    expect(screen.getByTestId('day-20-count')).toHaveTextContent('1')
    await user.click(screen.getByTestId('day-20'))
    expect(screen.getByTestId('event-v4-title')).toHaveTextContent('Party')
  })
})

describe('categories view', () => {
  it('shows the count per category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('cat-work-count')).toHaveTextContent('1')
    expect(screen.getByTestId('cat-social-count')).toHaveTextContent('1')
    expect(screen.getByTestId('cat-personal-count')).toHaveTextContent('1')
  })

  it('updates a category count after creating an event', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('title-input'), 'Review')
    await user.clear(screen.getByTestId('day-input'))
    await user.type(screen.getByTestId('day-input'), '5')
    await user.selectOptions(screen.getByTestId('category-select'), 'work')
    await user.click(screen.getByTestId('submit-create'))
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('cat-work-count')).toHaveTextContent('2')
  })
})

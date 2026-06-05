import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('categories page', () => {
  it('shows each category with spent/remaining derived from transactions', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('category-c1-spent')).toHaveTextContent('180')
    expect(screen.getByTestId('category-c1-remaining')).toHaveTextContent('120')
    expect(screen.getByTestId('category-c1')).toHaveAttribute('data-over', 'false')
  })

  it('flags an over-limit category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('category-c2-spent')).toHaveTextContent('540')
    expect(screen.getByTestId('category-c2')).toHaveAttribute('data-over', 'true')
    expect(screen.getByTestId('category-c2-alert')).toBeInTheDocument()
    expect(screen.getByTestId('category-c2-remaining')).toHaveTextContent('-40')
  })

  it('does not flag a category that is within its limit', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('category-c3')).toHaveAttribute('data-over', 'false')
    expect(screen.queryByTestId('category-c3-alert')).not.toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the recipes page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-recipes')).toBeInTheDocument()
    expect(screen.getByTestId('nav-recipes')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-add')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the add page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
    expect(screen.getByTestId('nav-add')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the favorites page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('page-favorites')).toBeInTheDocument()
  })

  it('navigates to detail and back to recipes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-recipe-detail'))
    expect(screen.getByTestId('page-recipe-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-recipes'))
    expect(screen.getByTestId('page-recipes')).toBeInTheDocument()
    expect(screen.getByTestId('nav-recipe-detail')).not.toHaveAttribute('aria-current')
  })

  it('shows the favorites badge count from seed data', () => {
    render(<App />)
    // seed: only Chicken Tacos is favorited
    expect(screen.getByTestId('fav-badge')).toHaveTextContent('1')
  })
})

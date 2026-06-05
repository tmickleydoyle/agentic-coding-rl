import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('category stats', () => {
  it('shows total, published, and draft counts from seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    // seed: 3 posts, 2 published, 1 draft
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-published-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-draft-value')).toHaveTextContent('1')
  })

  it('shows per-category counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('category-count-c1-value')).toHaveTextContent('1')
    expect(screen.getByTestId('category-count-c2-value')).toHaveTextContent('1')
    expect(screen.getByTestId('category-count-c3-value')).toHaveTextContent('1')
  })

  it('updates stats after publishing a draft', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-posts'))
    await user.click(screen.getByTestId('publish-b2')) // publish Design Systems
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('stat-published-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-draft-value')).toHaveTextContent('0')
  })

  it('updates total after adding a post', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-editor'))
    await user.type(screen.getByTestId('title-input'), 'Extra')
    await user.click(screen.getByTestId('submit-post'))
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('4')
  })
})

describe('published view + theme', () => {
  it('lists only published posts with a count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-published'))
    expect(screen.getByTestId('published-count')).toHaveTextContent('2')
    expect(screen.getByTestId('published-b1')).toBeInTheDocument()
    expect(screen.getByTestId('published-b3')).toBeInTheDocument()
    expect(screen.queryByTestId('published-b2')).not.toBeInTheDocument()
  })

  it('defaults to light theme reflected on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles the theme and persists it across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-published'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-posts'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})

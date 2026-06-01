import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('categories + stats', () => {
  it('lists categories with their thread counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('category-g1-name')).toHaveTextContent('General')
    expect(screen.getByTestId('category-g1-count')).toHaveTextContent('1')
    expect(screen.getByTestId('category-g2-count')).toHaveTextContent('1')
    expect(screen.getByTestId('category-g3-count')).toHaveTextContent('1')
  })

  it('shows forum stats from the seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('stat-threads')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-replies')).toHaveTextContent('3')
    // votes: 5 + 2 + 8 = 15
    expect(screen.getByTestId('stat-votes')).toHaveTextContent('15')
  })

  it('updates the category count after adding a thread', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    await user.type(screen.getByTestId('title-input'), 'Another general post')
    // category-select defaults to g1 (General)
    await user.click(screen.getByTestId('submit-thread'))
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('category-g1-count')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-threads')).toHaveTextContent('4')
  })

  it('updates the votes stat after upvoting a thread', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('upvote-t1'))
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('stat-votes')).toHaveTextContent('16')
  })
})

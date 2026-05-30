import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('categories', () => {
  it('lists categories in first-seen order with counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    const items = screen.getAllByTestId(/^cat-[A-Za-z]+$/)
    expect(items.map((el) => el.getAttribute('data-testid'))).toEqual(['cat-Tips', 'cat-Fun'])
    expect(screen.getByTestId('cat-Tips-count')).toHaveTextContent('3')
    expect(screen.getByTestId('cat-Fun-count')).toHaveTextContent('2')
  })

  it('filtering by a category navigates to a filtered feed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    await user.click(screen.getByTestId('cat-Tips-filter'))
    expect(screen.getByTestId('page-feed')).toBeInTheDocument()
    expect(screen.getByTestId('active-category')).toHaveTextContent('Tips')
    const clips = screen.getAllByTestId(/^clip-c\d$/)
    expect(clips.map((el) => el.getAttribute('data-testid'))).toEqual([
      'clip-c1',
      'clip-c3',
      'clip-c5',
    ])
  })
})

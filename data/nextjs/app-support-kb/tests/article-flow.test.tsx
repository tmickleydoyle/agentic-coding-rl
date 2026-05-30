import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('article flow', () => {
  it('lists seeded articles with their category', () => {
    render(<App />)
    const list = screen.getByTestId('article-list')
    expect(within(list).getByText('Reset your password')).toBeInTheDocument()
    expect(screen.getByTestId('article-a1-category')).toHaveTextContent('account')
    expect(screen.getByTestId('article-a2-category')).toHaveTextContent('billing')
  })

  it('filters the article list by category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('category-filter'), 'billing')
    const list = screen.getByTestId('article-list')
    expect(within(list).getByTestId('article-a2')).toBeInTheDocument()
    expect(within(list).getByTestId('article-a5')).toBeInTheDocument()
    expect(within(list).queryByTestId('article-a1')).not.toBeInTheDocument()
  })

  it('shows an empty state for a category with no articles after filtering', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('category-filter'), 'account')
    const list = screen.getByTestId('article-list')
    expect(within(list).getByTestId('article-a1')).toBeInTheDocument()
    expect(within(list).queryByTestId('article-a2')).not.toBeInTheDocument()
  })

  it('shows a no-selection message before opening', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-article-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('opens an article and shows its body and votes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-a1'))
    expect(screen.getByTestId('page-article-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Reset your password')
    expect(screen.getByTestId('detail-category')).toHaveTextContent('account')
    expect(screen.getByTestId('detail-helpful')).toHaveTextContent('5')
    expect(screen.getByTestId('detail-not-helpful')).toHaveTextContent('1')
  })

  it('increments the helpful count when voting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-a2'))
    expect(screen.getByTestId('detail-helpful')).toHaveTextContent('3')
    await user.click(screen.getByTestId('vote-helpful'))
    expect(screen.getByTestId('detail-helpful')).toHaveTextContent('4')
  })

  it('increments the not-helpful count when voting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-a3'))
    expect(screen.getByTestId('detail-not-helpful')).toHaveTextContent('2')
    await user.click(screen.getByTestId('vote-not-helpful'))
    expect(screen.getByTestId('detail-not-helpful')).toHaveTextContent('3')
  })

  it('persists a vote when navigating away and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-a4'))
    await user.click(screen.getByTestId('vote-helpful'))
    expect(screen.getByTestId('detail-helpful')).toHaveTextContent('9')
    await user.click(screen.getByTestId('nav-articles'))
    await user.click(screen.getByTestId('open-a4'))
    expect(screen.getByTestId('detail-helpful')).toHaveTextContent('9')
  })
})

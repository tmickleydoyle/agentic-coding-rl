import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('categories and search', () => {
  it('shows article counts per category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('category-account-value')).toHaveTextContent('1')
    expect(screen.getByTestId('category-billing-value')).toHaveTextContent('2')
    expect(screen.getByTestId('category-technical-value')).toHaveTextContent('1')
    expect(screen.getByTestId('category-general-value')).toHaveTextContent('1')
  })

  it('shows a hint before typing a query', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    expect(screen.getByTestId('search-hint')).toBeInTheDocument()
  })

  it('matches articles by title text', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    await user.type(screen.getByTestId('search-input'), 'password')
    const results = screen.getByTestId('search-results')
    expect(within(results).getByTestId('result-a1')).toBeInTheDocument()
    expect(within(results).queryByTestId('result-a2')).not.toBeInTheDocument()
  })

  it('matches articles by body text case-insensitively', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    await user.type(screen.getByTestId('search-input'), 'BILLING')
    const results = screen.getByTestId('search-results')
    expect(within(results).getByTestId('result-a2')).toBeInTheDocument()
    expect(within(results).getByTestId('result-a5')).toBeInTheDocument()
  })

  it('shows a no-results message when nothing matches', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    await user.type(screen.getByTestId('search-input'), 'zzznope')
    expect(screen.getByTestId('no-results')).toBeInTheDocument()
  })

  it('opens an article from a search result', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    await user.type(screen.getByTestId('search-input'), 'password')
    await user.click(screen.getByTestId('open-result-a1'))
    expect(screen.getByTestId('page-article-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Reset your password')
  })
})

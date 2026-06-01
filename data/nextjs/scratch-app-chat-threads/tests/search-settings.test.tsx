import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('search and settings', () => {
  it('lists all messages by default in search', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    expect(screen.getByTestId('result-m1')).toBeInTheDocument()
    expect(screen.getByTestId('result-m2')).toBeInTheDocument()
    expect(screen.getByTestId('result-m3')).toBeInTheDocument()
  })

  it('filters messages by query case-insensitively', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    await user.type(screen.getByTestId('message-search'), 'DEPLOY')
    expect(screen.getByTestId('result-m1')).toBeInTheDocument()
    expect(screen.queryByTestId('result-m2')).not.toBeInTheDocument()
  })

  it('shows a no-results message when nothing matches', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    await user.type(screen.getByTestId('message-search'), 'zzz')
    expect(screen.getByTestId('no-results')).toBeInTheDocument()
    expect(screen.queryByTestId('search-list')).not.toBeInTheDocument()
  })

  it('opens a thread from a search result', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    await user.click(screen.getByTestId('open-result-m2'))
    expect(screen.getByTestId('page-thread')).toBeInTheDocument()
    expect(screen.getByTestId('thread-text')).toHaveTextContent('Lunch spot ideas')
  })

  it('defaults to light theme and switches to dark', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-settings'))
    await user.selectOptions(screen.getByTestId('theme-select'), 'dark')
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('shows channel stats from the seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('stat-messages')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-open')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-replies')).toHaveTextContent('4')
  })

  it('updates open stats after resolving a message', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-m1'))
    await user.click(screen.getByTestId('resolve-toggle'))
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('stat-open')).toHaveTextContent('1')
  })

  it('persists a posted message across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('post-input'), 'Persisted topic')
    await user.click(screen.getByTestId('post-submit'))
    await user.click(screen.getByTestId('nav-settings'))
    await user.click(screen.getByTestId('nav-channel'))
    expect(screen.getByText('Persisted topic')).toBeInTheDocument()
  })
})

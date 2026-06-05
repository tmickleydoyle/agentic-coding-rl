import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('snippets list', () => {
  it('lists the seeded snippets', () => {
    render(<App />)
    const list = screen.getByTestId('snippet-list')
    expect(within(list).getByTestId('snippet-s1-title')).toHaveTextContent('Debounce')
    expect(within(list).getByTestId('snippet-s2-language')).toHaveTextContent('python')
  })

  it('filters by language', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('language-filter'), 'css')
    expect(screen.getByTestId('snippet-s3')).toBeInTheDocument()
    expect(screen.queryByTestId('snippet-s1')).not.toBeInTheDocument()
  })

  it('searches by title (case-insensitive)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('search-input'), 'QUICK')
    expect(screen.getByTestId('snippet-s2')).toBeInTheDocument()
    expect(screen.queryByTestId('snippet-s1')).not.toBeInTheDocument()
  })

  it('combines language filter and search with AND', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('language-filter'), 'js')
    await user.type(screen.getByTestId('search-input'), 'quick')
    expect(screen.getByTestId('snippets-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('snippet-list')).not.toBeInTheDocument()
  })

  it('favoriting from the list adds it to favorites', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('fav-s1'))
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('favorite-s1')).toBeInTheDocument()
  })
})

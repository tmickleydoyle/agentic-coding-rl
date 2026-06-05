import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add and favorites', () => {
  it('blocks adding without a title or language', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('title-input'), 'Only title')
    await user.click(screen.getByTestId('save-snippet'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('adds a snippet and shows it in the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('title-input'), 'Memoize')
    await user.type(screen.getByTestId('language-input'), 'ts')
    await user.click(screen.getByTestId('save-snippet'))
    expect(screen.getByTestId('page-snippets')).toBeInTheDocument()
    expect(within(screen.getByTestId('snippet-list')).getByText('Memoize')).toBeInTheDocument()
  })

  it('shows the seeded favorite and removes it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('favorite-s2')).toBeInTheDocument()
    await user.click(screen.getByTestId('unfav-s2'))
    expect(screen.getByTestId('favorites-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('favorites-list')).not.toBeInTheDocument()
  })
})

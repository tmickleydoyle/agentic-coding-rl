import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchFilter from '../components/SearchFilter'

describe('SearchFilter', () => {
  it('shows all items with an empty query', () => {
    render(<SearchFilter />)
    expect(screen.getByTestId('item-Apple')).toBeInTheDocument()
    expect(screen.getByTestId('item-Orange')).toBeInTheDocument()
  })

  it('matches a lowercase substring', async () => {
    const user = userEvent.setup()
    render(<SearchFilter />)
    await user.type(screen.getByTestId('query'), 'ap')
    expect(screen.getByTestId('item-Apple')).toBeInTheDocument()
    expect(screen.getByTestId('item-Grape')).toBeInTheDocument()
    expect(screen.queryByTestId('item-Banana')).toBeNull()
  })

  it('matches an uppercase query against lowercase-containing items', async () => {
    const user = userEvent.setup()
    render(<SearchFilter />)
    await user.type(screen.getByTestId('query'), 'AP')
    expect(screen.getByTestId('item-Apple')).toBeInTheDocument()
    expect(screen.getByTestId('item-Pineapple')).toBeInTheDocument()
  })

  it('matches mixed case', async () => {
    const user = userEvent.setup()
    render(<SearchFilter />)
    await user.type(screen.getByTestId('query'), 'OrAnGe')
    expect(screen.getByTestId('item-Orange')).toBeInTheDocument()
    expect(screen.queryByTestId('item-Apple')).toBeNull()
  })

  it('shows nothing for a non-matching query', async () => {
    const user = userEvent.setup()
    render(<SearchFilter />)
    await user.type(screen.getByTestId('query'), 'zzz')
    expect(screen.getByTestId('results').children.length).toBe(0)
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchFilter from '../components/SearchFilter'

const ITEMS = ['Apple', 'Banana', 'Cherry', 'Apricot', 'Blueberry']

describe('SearchFilter', () => {
  it('shows all items with empty query', () => {
    render(<SearchFilter items={ITEMS} />)
    expect(within(screen.getByTestId('results')).getAllByRole('listitem')).toHaveLength(5)
  })

  it('filters case-insensitively', async () => {
    const user = userEvent.setup()
    render(<SearchFilter items={ITEMS} />)
    await user.type(screen.getByTestId('query'), 'ap')
    const items = within(screen.getByTestId('results')).getAllByRole('listitem').map((li) => li.textContent)
    expect(items).toEqual(['Apple', 'Apricot'])
  })

  it('shows no-results when nothing matches', async () => {
    const user = userEvent.setup()
    render(<SearchFilter items={ITEMS} />)
    await user.type(screen.getByTestId('query'), 'zzz')
    expect(within(screen.getByTestId('results')).queryAllByRole('listitem')).toHaveLength(0)
    expect(screen.getByTestId('no-results')).toHaveTextContent('No matches')
  })

  it('no-results goes away once a match returns', async () => {
    const user = userEvent.setup()
    render(<SearchFilter items={ITEMS} />)
    const q = screen.getByTestId('query')
    await user.type(q, 'zzz')
    expect(screen.getByTestId('no-results')).toBeInTheDocument()
    await user.clear(q)
    await user.type(q, 'cher')
    expect(screen.queryByTestId('no-results')).toBeNull()
    expect(within(screen.getByTestId('results')).getAllByRole('listitem')).toHaveLength(1)
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchFilterList from '../components/SearchFilterList'

const items = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'apricot', label: 'Apricot' },
  { id: 'cherry', label: 'Cherry' },
]

describe('SearchFilterList', () => {
  it('renders all items when input is empty', () => {
    render(<SearchFilterList items={items} />)
    expect(screen.getByTestId('item-apple')).toBeDefined()
    expect(screen.getByTestId('item-banana')).toBeDefined()
    expect(screen.getByTestId('item-cherry')).toBeDefined()
  })

  it('filters items by query', async () => {
    const user = userEvent.setup()
    render(<SearchFilterList items={items} />)
    await user.type(screen.getByTestId('search-input'), 'ap')
    expect(screen.getByTestId('item-apple')).toBeDefined()
    expect(screen.getByTestId('item-apricot')).toBeDefined()
    expect(screen.queryByTestId('item-banana')).toBeNull()
  })

  it('filtering is case-insensitive', async () => {
    const user = userEvent.setup()
    render(<SearchFilterList items={items} />)
    await user.type(screen.getByTestId('search-input'), 'CHERRY')
    expect(screen.getByTestId('item-cherry')).toBeDefined()
  })

  it('shows no-results when nothing matches', async () => {
    const user = userEvent.setup()
    render(<SearchFilterList items={items} />)
    await user.type(screen.getByTestId('search-input'), 'zzz')
    expect(screen.getByTestId('no-results')).toBeDefined()
    expect(screen.queryByTestId('item-apple')).toBeNull()
  })

  it('restores full list after clearing input', async () => {
    const user = userEvent.setup()
    render(<SearchFilterList items={items} />)
    await user.type(screen.getByTestId('search-input'), 'ap')
    await user.clear(screen.getByTestId('search-input'))
    expect(screen.getByTestId('item-banana')).toBeDefined()
    expect(screen.getByTestId('item-cherry')).toBeDefined()
  })
})

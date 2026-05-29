import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilteredList from '../components/FilteredList'

const ITEMS = ['Apple', 'Banana', 'Cherry', 'Avocado', 'Blueberry']

describe('FilteredList', () => {
  it('starts showing all items', () => {
    render(<FilteredList items={ITEMS} />)
    expect(within(screen.getByTestId('filtered-list')).getAllByRole('listitem')).toHaveLength(5)
    expect(screen.getByTestId('match-count')).toHaveTextContent('5')
  })

  it('filters case-insensitively as the user types', async () => {
    const user = userEvent.setup()
    render(<FilteredList items={ITEMS} />)
    await user.type(screen.getByTestId('filter-input'), 'a')
    // "a" matches Apple, Banana, Avocado (4 actually: Apple has 'a', Banana, Avocado — Cherry/Blueberry do not contain 'a')
    const items = within(screen.getByTestId('filtered-list')).getAllByRole('listitem')
    expect(items.length).toBeGreaterThan(0)
    items.forEach((li) => expect(li.textContent!.toLowerCase()).toContain('a'))
    expect(screen.getByTestId('match-count')).toHaveTextContent(String(items.length))
  })

  it('shows zero matches for a non-matching query', async () => {
    const user = userEvent.setup()
    render(<FilteredList items={ITEMS} />)
    await user.type(screen.getByTestId('filter-input'), 'zzz')
    expect(within(screen.getByTestId('filtered-list')).queryAllByRole('listitem')).toHaveLength(0)
    expect(screen.getByTestId('match-count')).toHaveTextContent('0')
  })

  it('clearing the input restores all items', async () => {
    const user = userEvent.setup()
    render(<FilteredList items={ITEMS} />)
    const input = screen.getByTestId('filter-input') as HTMLInputElement
    await user.type(input, 'cher')
    expect(within(screen.getByTestId('filtered-list')).getAllByRole('listitem')).toHaveLength(1)
    await user.clear(input)
    expect(within(screen.getByTestId('filtered-list')).getAllByRole('listitem')).toHaveLength(5)
  })
})

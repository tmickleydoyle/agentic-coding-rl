import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import ItemList from '../components/ItemList'

describe('ItemList', () => {
  it('renders one <li> per item in order', () => {
    render(<ItemList items={['apple', 'banana', 'cherry']} />)
    const items = within(screen.getByTestId('list')).getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(items[0]).toHaveTextContent('apple')
    expect(items[1]).toHaveTextContent('banana')
    expect(items[2]).toHaveTextContent('cherry')
  })

  it('shows empty state when items is empty', () => {
    render(<ItemList items={[]} />)
    expect(screen.getByTestId('empty')).toHaveTextContent('No items')
    expect(screen.queryByTestId('list')).toBeNull()
  })

  it('handles a single-item list', () => {
    render(<ItemList items={['solo']} />)
    expect(screen.queryByTestId('empty')).toBeNull()
    const items = within(screen.getByTestId('list')).getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent('solo')
  })
})

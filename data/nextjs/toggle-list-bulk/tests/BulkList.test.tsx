import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BulkList from '../components/BulkList'
import type { Item } from '../components/types'

const ITEMS: Item[] = [
  { id: 1, label: 'Alpha' },
  { id: 2, label: 'Beta' },
  { id: 3, label: 'Gamma' },
]

describe('Bulk toggle list', () => {
  it('renders all rows unchecked with 0 selected', () => {
    render(<BulkList initialItems={ITEMS} />)
    expect(screen.getAllByTestId(/^row-/)).toHaveLength(3)
    expect(screen.getByTestId('count')).toHaveTextContent('0 selected')
    expect(screen.getByTestId('check-1')).not.toBeChecked()
    expect(screen.getByTestId('delete')).toBeDisabled()
  })

  it('checking a row updates the count and enables Delete', async () => {
    const user = userEvent.setup()
    render(<BulkList initialItems={ITEMS} />)
    await user.click(screen.getByTestId('check-2'))
    expect(screen.getByTestId('check-2')).toBeChecked()
    expect(screen.getByTestId('count')).toHaveTextContent('1 selected')
    expect(screen.getByTestId('delete')).not.toBeDisabled()
  })

  it('unchecking a row decrements the count', async () => {
    const user = userEvent.setup()
    render(<BulkList initialItems={ITEMS} />)
    await user.click(screen.getByTestId('check-1'))
    await user.click(screen.getByTestId('check-3'))
    expect(screen.getByTestId('count')).toHaveTextContent('2 selected')
    await user.click(screen.getByTestId('check-1'))
    expect(screen.getByTestId('count')).toHaveTextContent('1 selected')
    expect(screen.getByTestId('check-1')).not.toBeChecked()
  })

  it('Select all checks every row', async () => {
    const user = userEvent.setup()
    render(<BulkList initialItems={ITEMS} />)
    await user.click(screen.getByTestId('select-all'))
    expect(screen.getByTestId('count')).toHaveTextContent('3 selected')
    expect(screen.getByTestId('check-1')).toBeChecked()
    expect(screen.getByTestId('check-2')).toBeChecked()
    expect(screen.getByTestId('check-3')).toBeChecked()
  })

  it('Clear deselects everything', async () => {
    const user = userEvent.setup()
    render(<BulkList initialItems={ITEMS} />)
    await user.click(screen.getByTestId('select-all'))
    await user.click(screen.getByTestId('clear'))
    expect(screen.getByTestId('count')).toHaveTextContent('0 selected')
    expect(screen.getByTestId('check-2')).not.toBeChecked()
    expect(screen.getByTestId('delete')).toBeDisabled()
  })

  it('Delete selected removes only checked rows and resets count', async () => {
    const user = userEvent.setup()
    render(<BulkList initialItems={ITEMS} />)
    await user.click(screen.getByTestId('check-1'))
    await user.click(screen.getByTestId('check-3'))
    await user.click(screen.getByTestId('delete'))
    expect(screen.queryByTestId('row-1')).toBeNull()
    expect(screen.queryByTestId('row-3')).toBeNull()
    expect(screen.getByTestId('row-2')).toBeInTheDocument()
    expect(screen.getByTestId('count')).toHaveTextContent('0 selected')
  })

  it('the surviving row is no longer selected after delete', async () => {
    const user = userEvent.setup()
    render(<BulkList initialItems={ITEMS} />)
    await user.click(screen.getByTestId('select-all'))
    await user.click(screen.getByTestId('check-2')) // deselect Beta
    await user.click(screen.getByTestId('delete')) // deletes 1 and 3
    expect(screen.getByTestId('row-2')).toBeInTheDocument()
    expect(screen.getByTestId('check-2')).not.toBeChecked()
    expect(screen.getByTestId('count')).toHaveTextContent('0 selected')
  })
})

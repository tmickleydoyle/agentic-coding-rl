import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('list page', () => {
  it('lists seeded items', () => {
    render(<App />)
    const list = screen.getByTestId('item-list')
    expect(within(list).getByText('Milk')).toBeInTheDocument()
    expect(within(list).getByText('Apples')).toBeInTheDocument()
    expect(within(list).getByText('Cheddar')).toBeInTheDocument()
    expect(within(list).getByText('Bananas')).toBeInTheDocument()
  })

  it('reflects bought state on the row', () => {
    render(<App />)
    expect(screen.getByTestId('item-i1')).toHaveAttribute('data-bought', 'false')
    expect(screen.getByTestId('item-i3')).toHaveAttribute('data-bought', 'true')
  })

  it('toggles an item bought and updates the remaining badge', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('toggle-i1'))
    expect(screen.getByTestId('item-i1')).toHaveAttribute('data-bought', 'true')
    // 4 items, now 2 bought -> 2 remaining
    expect(screen.getByTestId('remaining-badge')).toHaveTextContent('2')
  })

  it('removes an item', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('remove-i2'))
    expect(screen.queryByTestId('item-i2')).not.toBeInTheDocument()
  })

  it('clears bought items into history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('clear-bought'))
    // Cheddar (bought) gone from the list
    expect(screen.queryByTestId('item-i3')).not.toBeInTheDocument()
    expect(screen.getByTestId('item-i1')).toBeInTheDocument()
    // and present in history
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('history-i3')).toBeInTheDocument()
  })

  it('shows the list-empty state after removing everything', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('remove-i1'))
    await user.click(screen.getByTestId('remove-i2'))
    await user.click(screen.getByTestId('remove-i3'))
    await user.click(screen.getByTestId('remove-i4'))
    expect(screen.getByTestId('list-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('item-list')).not.toBeInTheDocument()
  })
})

describe('add item', () => {
  it('blocks submitting an item with an empty name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.click(screen.getByTestId('submit-item'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('adds an item and shows it in the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Eggs')
    await user.type(screen.getByTestId('aisle-input'), 'Dairy')
    await user.click(screen.getByTestId('submit-item'))
    expect(screen.getByTestId('page-list')).toBeInTheDocument()
    expect(within(screen.getByTestId('item-list')).getByText('Eggs')).toBeInTheDocument()
  })

  it('defaults aisle to Other and qty to 1 when blank', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Salt')
    await user.click(screen.getByTestId('submit-item'))
    expect(screen.getByTestId('item-i5-qty')).toHaveTextContent('1')
    await user.click(screen.getByTestId('nav-aisles'))
    expect(screen.getByTestId('aisle-Other')).toBeInTheDocument()
  })
})

describe('history page', () => {
  it('shows the history-empty state initially', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('history-empty')).toBeInTheDocument()
  })
})

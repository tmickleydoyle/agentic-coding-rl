import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Travel Packing List', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByText('Travel Packing List')).toBeInTheDocument()
  })

  it('shows 6 seed items', () => {
    expect(screen.getAllByTestId('packing-item')).toHaveLength(6)
  })

  it('shows initial progress 2 / 6 packed', () => {
    expect(screen.getByTestId('pack-progress').textContent).toBe('2 / 6 packed')
  })

  it('seed items show name and category', () => {
    const items = screen.getAllByTestId('packing-item')
    expect(items[0].textContent).toContain('Passport')
    expect(items[0].textContent).toContain('Documents')
  })

  it('toggles an item to packed', async () => {
    const user = userEvent.setup()
    const checkbox = screen.getByLabelText('Passport')
    await user.click(checkbox)
    expect(screen.getByTestId('pack-progress').textContent).toBe('3 / 6 packed')
  })

  it('toggles a packed item to unpacked', async () => {
    const user = userEvent.setup()
    const checkbox = screen.getByLabelText('Toothbrush')
    await user.click(checkbox)
    expect(screen.getByTestId('pack-progress').textContent).toBe('1 / 6 packed')
  })

  it('adds a new item', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/item name/i), 'Swimsuit')
    await user.selectOptions(screen.getByLabelText(/^Category$/i), 'Clothing')
    await user.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getAllByTestId('packing-item')).toHaveLength(7)
  })

  it('new item starts as unpacked', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/item name/i), 'Swimsuit')
    await user.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByTestId('pack-progress').textContent).toBe('2 / 7 packed')
  })

  it('does not add item with empty name', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getAllByTestId('packing-item')).toHaveLength(6)
  })

  it('removes an item', async () => {
    const user = userEvent.setup()
    const removeBtns = screen.getAllByTestId('remove-item')
    await user.click(removeBtns[0])
    expect(screen.getAllByTestId('packing-item')).toHaveLength(5)
  })

  it('filters by category', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by category/i), 'Electronics')
    expect(screen.getAllByTestId('packing-item')).toHaveLength(2)
  })

  it('show unpacked filter works', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /show unpacked/i }))
    // 4 unpacked items
    expect(screen.getAllByTestId('packing-item')).toHaveLength(4)
  })

  it('show all restores full list', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /show unpacked/i }))
    await user.click(screen.getByRole('button', { name: /show all/i }))
    expect(screen.getAllByTestId('packing-item')).toHaveLength(6)
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('packing list', () => {
  it('lists seeded trips with percent packed', () => {
    render(<App />)
    // tr1: 1 of 3 packed = 33
    expect(screen.getByTestId('trip-tr1-percent')).toHaveTextContent('33')
    // tr2: 0 of 1 = 0
    expect(screen.getByTestId('trip-tr2-percent')).toHaveTextContent('0')
  })

  it('opens a trip and groups items by category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr1'))
    expect(screen.getByTestId('page-list')).toBeInTheDocument()
    expect(screen.getByTestId('list-name')).toHaveTextContent('Beach Weekend')
    expect(screen.getByTestId('category-clothing')).toBeInTheDocument()
    expect(screen.getByTestId('category-toiletries')).toBeInTheDocument()
    expect(screen.getByTestId('category-documents')).toBeInTheDocument()
    // electronics has no items for tr1, so its block is absent
    expect(screen.queryByTestId('category-electronics')).not.toBeInTheDocument()
  })

  it('shows packed/total counts per category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr1'))
    expect(screen.getByTestId('category-clothing-count')).toHaveTextContent('1/1')
    expect(screen.getByTestId('category-toiletries-count')).toHaveTextContent('0/1')
  })

  it('toggles an item packed and updates the percent', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr1'))
    expect(screen.getByTestId('list-percent')).toHaveTextContent('33')
    expect(screen.getByTestId('item-i2')).toHaveAttribute('data-packed', 'false')
    await user.click(screen.getByTestId('toggle-i2'))
    expect(screen.getByTestId('item-i2')).toHaveAttribute('data-packed', 'true')
    // now 2 of 3 = 67
    expect(screen.getByTestId('list-percent')).toHaveTextContent('67')
  })

  it('removes an item from the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr1'))
    expect(screen.getByTestId('item-i3')).toBeInTheDocument()
    await user.click(screen.getByTestId('remove-i3'))
    expect(screen.queryByTestId('item-i3')).not.toBeInTheDocument()
    // documents category had only i3, so its block disappears
    expect(screen.queryByTestId('category-documents')).not.toBeInTheDocument()
  })

  it('renders only the selected trip items', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr2'))
    expect(within(screen.getByTestId('page-list')).getByText('Gloves')).toBeInTheDocument()
    expect(screen.queryByTestId('item-i1')).not.toBeInTheDocument()
  })
})

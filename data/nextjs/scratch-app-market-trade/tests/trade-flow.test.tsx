import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('items', () => {
  it('lists seeded items with owners', () => {
    render(<App />)
    expect(screen.getByTestId('item-i1-name')).toHaveTextContent('Skateboard')
    expect(screen.getByTestId('item-i1-owner')).toHaveTextContent('nina')
    expect(screen.getByTestId('item-i2-name')).toHaveTextContent('Guitar')
  })

  it('opens an item detail via view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-i2'))
    expect(screen.getByTestId('page-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Guitar')
  })
})

describe('offers on an item', () => {
  it('shows offers for the selected item', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-i2'))
    expect(screen.getByTestId('offer-of1')).toBeInTheDocument()
    expect(screen.getByTestId('offer-of1-give')).toHaveTextContent('Headphones')
    expect(screen.getByTestId('offer-of2')).toHaveAttribute('data-status', 'accepted')
  })

  it('shows no-offers for an item without offers', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-i3'))
    expect(screen.getByTestId('no-offers')).toBeInTheDocument()
    expect(screen.queryByTestId('offer-list')).not.toBeInTheDocument()
  })

  it('accepts a pending offer and hides its action buttons', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-i2'))
    expect(screen.getByTestId('offer-of1')).toHaveAttribute('data-status', 'pending')
    await user.click(screen.getByTestId('accept-of1'))
    expect(screen.getByTestId('offer-of1')).toHaveAttribute('data-status', 'accepted')
    expect(screen.queryByTestId('accept-of1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('decline-of1')).not.toBeInTheDocument()
  })

  it('declines a pending offer', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-i2'))
    await user.click(screen.getByTestId('decline-of1'))
    expect(screen.getByTestId('offer-of1')).toHaveAttribute('data-status', 'declined')
  })

  it('only pending offers expose accept/decline buttons', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-i2'))
    // of2 is accepted from the seed
    expect(screen.queryByTestId('accept-of2')).not.toBeInTheDocument()
  })
})

describe('proposing a swap', () => {
  it('blocks proposing with a blank give', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-i3'))
    await user.click(screen.getByTestId('submit-offer'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.queryByTestId('offer-list')).not.toBeInTheDocument()
  })

  it('proposes a swap and the new offer appears', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-i3'))
    await user.type(screen.getByTestId('give-input'), 'Vinyl records')
    await user.click(screen.getByTestId('submit-offer'))
    const list = screen.getByTestId('offer-list')
    expect(within(list).getByText('Vinyl records')).toBeInTheDocument()
    expect(screen.getByTestId('offer-of4')).toHaveAttribute('data-status', 'pending')
  })

  it('a proposed swap shows under my trades', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-i3'))
    await user.type(screen.getByTestId('give-input'), 'Vinyl records')
    await user.click(screen.getByTestId('submit-offer'))
    await user.click(screen.getByTestId('nav-mytrades'))
    expect(screen.getByTestId('mytrade-of4')).toBeInTheDocument()
  })
})

describe('all offers view with status filter', () => {
  it('lists all offers by default', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-offers'))
    expect(screen.getByTestId('alloffer-of1')).toBeInTheDocument()
    expect(screen.getByTestId('alloffer-of2')).toBeInTheDocument()
    expect(screen.getByTestId('alloffer-of3')).toBeInTheDocument()
  })

  it('filters offers by status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-offers'))
    await user.selectOptions(screen.getByTestId('status-filter'), 'accepted')
    expect(screen.getByTestId('alloffer-of2')).toBeInTheDocument()
    expect(screen.queryByTestId('alloffer-of1')).not.toBeInTheDocument()
  })

  it('shows no-matching when no offer matches the filter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-offers'))
    await user.selectOptions(screen.getByTestId('status-filter'), 'declined')
    expect(screen.getByTestId('no-matching')).toBeInTheDocument()
    expect(screen.queryByTestId('all-offers-list')).not.toBeInTheDocument()
  })
})

describe('my trades', () => {
  it('shows seed offer made by me', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-mytrades'))
    expect(screen.getByTestId('mytrade-of3')).toBeInTheDocument()
    expect(screen.getByTestId('mytrade-of3-item')).toHaveTextContent('Skateboard')
    expect(screen.queryByTestId('mytrade-of1')).not.toBeInTheDocument()
  })
})

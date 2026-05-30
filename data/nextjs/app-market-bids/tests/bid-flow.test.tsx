import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('auction list', () => {
  it('lists seeded auctions with current bid and time', () => {
    render(<App />)
    const list = screen.getByTestId('auction-list')
    expect(within(list).getByText('Vintage camera')).toBeInTheDocument()
    expect(screen.getByTestId('auction-a1-bid')).toHaveTextContent('50')
    expect(screen.getByTestId('auction-a1-time')).toHaveTextContent('5h')
  })

  it('marks closed auctions via data-closed', () => {
    render(<App />)
    expect(screen.getByTestId('auction-a2')).toHaveAttribute('data-closed', 'true')
    expect(screen.getByTestId('auction-a1')).toHaveAttribute('data-closed', 'false')
  })

  it('opens an auction detail via view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-a1'))
    expect(screen.getByTestId('page-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Vintage camera')
    expect(screen.getByTestId('detail-high')).toHaveTextContent('dave')
  })
})

describe('bidding', () => {
  it('places a valid bid that beats the current bid', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-a1'))
    await user.type(screen.getByTestId('bid-input'), '60')
    await user.click(screen.getByTestId('place-bid'))
    expect(screen.getByTestId('detail-bid')).toHaveTextContent('60')
    expect(screen.getByTestId('detail-high')).toHaveTextContent('me')
    expect(screen.queryByTestId('bid-error')).not.toBeInTheDocument()
  })

  it('rejects a bid that does not beat the current bid', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-a1'))
    await user.type(screen.getByTestId('bid-input'), '40')
    await user.click(screen.getByTestId('place-bid'))
    expect(screen.getByTestId('bid-error')).toBeInTheDocument()
    expect(screen.getByTestId('detail-bid')).toHaveTextContent('50')
  })

  it('rejects a bid equal to the current bid', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-a3'))
    await user.type(screen.getByTestId('bid-input'), '120')
    await user.click(screen.getByTestId('place-bid'))
    expect(screen.getByTestId('bid-error')).toBeInTheDocument()
    expect(screen.getByTestId('detail-bid')).toHaveTextContent('120')
  })

  it('hides the bid form and shows a closed note for a closed auction', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-a2'))
    expect(screen.getByTestId('closed-note')).toBeInTheDocument()
    expect(screen.queryByTestId('bid-form')).not.toBeInTheDocument()
  })

  it('placing a bid then shows it on the my-bids page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-a1'))
    await user.type(screen.getByTestId('bid-input'), '75')
    await user.click(screen.getByTestId('place-bid'))
    await user.click(screen.getByTestId('nav-mybids'))
    const list = screen.getByTestId('mybids-list')
    expect(within(list).getByText('Vintage camera')).toBeInTheDocument()
  })

  it('closing an auction in detail and winning it lists it under won', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-a1'))
    await user.type(screen.getByTestId('bid-input'), '90')
    await user.click(screen.getByTestId('place-bid'))
    await user.click(screen.getByTestId('close-auction'))
    await user.click(screen.getByTestId('nav-won'))
    expect(screen.getByTestId('won-a1')).toBeInTheDocument()
  })
})

describe('my bids and won views', () => {
  it('shows the seed bid on my-bids initially', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-mybids'))
    expect(screen.getByTestId('mybid-b1')).toBeInTheDocument()
    expect(screen.getByTestId('mybid-b1-amount')).toHaveTextContent('20')
  })

  it('shows the seed won auction a2 under won', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-won'))
    expect(screen.getByTestId('won-a2')).toBeInTheDocument()
    expect(screen.queryByTestId('won-a1')).not.toBeInTheDocument()
  })
})

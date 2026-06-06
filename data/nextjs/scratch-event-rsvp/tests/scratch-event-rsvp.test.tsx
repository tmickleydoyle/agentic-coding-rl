import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Event RSVP Manager', () => {
  it('renders the heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /event rsvp manager/i })).toBeInTheDocument()
  })

  it('shows seed total rsvps', () => {
    render(<App />)
    // Alice, Bob, Carol, Dave, Eve = 5
    expect(screen.getByTestId('total-rsvps')).toHaveTextContent('Total RSVPs: 5')
  })

  it('shows open events count', () => {
    render(<App />)
    // event 1: 1 spot, event 2: 1 spot, event 3: 4 spots, event 4: 0 spots => 3 open
    expect(screen.getByTestId('open-events')).toHaveTextContent('Open Events: 3')
  })

  it('shows spots left for each event', () => {
    render(<App />)
    expect(screen.getByTestId('spots-1')).toHaveTextContent('Spots left: 1')
    expect(screen.getByTestId('spots-2')).toHaveTextContent('Spots left: 1')
    expect(screen.getByTestId('spots-3')).toHaveTextContent('Spots left: 4')
    expect(screen.getByTestId('spots-4')).toHaveTextContent('Spots left: 0')
  })

  it('shows correct status badges', () => {
    render(<App />)
    expect(screen.getByTestId('status-1')).toHaveTextContent('Open')
    expect(screen.getByTestId('status-4')).toHaveTextContent('Full')
  })

  it('shows seed rsvps in list', () => {
    render(<App />)
    const list1 = screen.getByTestId('rsvp-list-1')
    expect(within(list1).getByText('Alice')).toBeInTheDocument()
    expect(within(list1).getByText('Bob')).toBeInTheDocument()
  })

  it('adds an rsvp to an event', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/select event/i), 'Startup Mixer')
    await user.type(screen.getByLabelText(/your name/i), 'Frank')
    await user.click(screen.getByRole('button', { name: /^rsvp$/i }))
    const list3 = screen.getByTestId('rsvp-list-3')
    expect(within(list3).getByText('Frank')).toBeInTheDocument()
    expect(screen.getByTestId('spots-3')).toHaveTextContent('Spots left: 3')
  })

  it('clears name input after successful rsvp', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/your name/i)
    await user.type(input, 'Grace')
    await user.click(screen.getByRole('button', { name: /^rsvp$/i }))
    expect(input).toHaveValue('')
  })

  it('does not add rsvp to full event', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/select event/i), 'AI Summit')
    await user.type(screen.getByLabelText(/your name/i), 'Zara')
    await user.click(screen.getByRole('button', { name: /^rsvp$/i }))
    expect(screen.getByTestId('spots-4')).toHaveTextContent('Spots left: 0')
  })

  it('does not add duplicate name (case-insensitive)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/select event/i), 'Tech Conference 2025')
    await user.type(screen.getByLabelText(/your name/i), 'alice')
    await user.click(screen.getByRole('button', { name: /^rsvp$/i }))
    expect(screen.getByTestId('spots-1')).toHaveTextContent('Spots left: 1')
  })

  it('cancels an rsvp', async () => {
    const user = userEvent.setup()
    render(<App />)
    const list1 = screen.getByTestId('rsvp-list-1')
    const cancelBtns = within(list1).getAllByRole('button', { name: /cancel/i })
    await user.click(cancelBtns[0])
    expect(screen.getByTestId('spots-1')).toHaveTextContent('Spots left: 2')
  })

  it('updates total rsvps after cancel', async () => {
    const user = userEvent.setup()
    render(<App />)
    const list1 = screen.getByTestId('rsvp-list-1')
    const cancelBtns = within(list1).getAllByRole('button', { name: /cancel/i })
    await user.click(cancelBtns[0])
    expect(screen.getByTestId('total-rsvps')).toHaveTextContent('Total RSVPs: 4')
  })

  it('updates open events when full event gets a cancellation', async () => {
    const user = userEvent.setup()
    render(<App />)
    const list4 = screen.getByTestId('rsvp-list-4')
    const cancelBtns = within(list4).getAllByRole('button', { name: /cancel/i })
    await user.click(cancelBtns[0])
    expect(screen.getByTestId('open-events')).toHaveTextContent('Open Events: 4')
    expect(screen.getByTestId('status-4')).toHaveTextContent('Open')
  })
})

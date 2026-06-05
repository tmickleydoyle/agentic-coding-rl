import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addClass(u: U, name: string, capacity: string) {
  await u.clear(screen.getByLabelText(/class name/i))
  await u.type(screen.getByLabelText(/class name/i), name)
  await u.clear(screen.getByLabelText(/capacity/i))
  await u.type(screen.getByLabelText(/capacity/i), capacity)
  await u.click(screen.getByRole('button', { name: /add class/i }))
}

async function book(u: U, className: string, member: string) {
  await u.selectOptions(screen.getByLabelText(/^class$/i), className)
  await u.clear(screen.getByLabelText(/member name/i))
  await u.type(screen.getByLabelText(/member name/i), member)
  await u.click(screen.getByRole('button', { name: /book spot/i }))
}

const roster = () => screen.getByRole('region', { name: 'Roster view' })

describe('Fitness class booking app', () => {
  it('starts on Classes', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Classes' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Bookings')
    expect(screen.getByRole('heading', { name: 'Bookings' })).toBeInTheDocument()
    await nav(u, 'Roster')
    expect(screen.getByRole('heading', { name: 'Roster' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Classes')
    expect(screen.getByRole('heading', { name: 'Classes' })).toBeInTheDocument()
  })

  it('adds a class shown with its capacity', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, 'Yoga', '2')
    expect(screen.getByText('Yoga (capacity 2)')).toBeInTheDocument()
  })

  it('ignores a blank class name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, '   ', '5')
    expect(screen.queryByText(/capacity 5/i)).not.toBeInTheDocument()
  })

  it('ignores a non-positive capacity', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, 'Spin', '0')
    expect(screen.queryByText(/spin/i)).not.toBeInTheDocument()
  })

  it('books a confirmed spot shown without waitlist marker', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, 'Yoga', '2')
    await nav(u, 'Bookings')
    await book(u, 'Yoga', 'Alice')
    expect(screen.getByText('Alice - Yoga')).toBeInTheDocument()
  })

  it('does nothing without a member name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, 'Yoga', '2')
    await nav(u, 'Bookings')
    await u.selectOptions(screen.getByLabelText(/^class$/i), 'Yoga')
    await u.click(screen.getByRole('button', { name: /book spot/i }))
    await nav(u, 'Roster')
    expect(within(roster()).getByText(/yoga: 0\/2 booked/i)).toBeInTheDocument()
  })

  it('shows confirmed count over capacity in the roster (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, 'Yoga', '3')
    await nav(u, 'Bookings')
    await book(u, 'Yoga', 'Alice')
    await book(u, 'Yoga', 'Bob')
    await nav(u, 'Roster')
    expect(within(roster()).getByText(/yoga: 2\/3 booked/i)).toBeInTheDocument()
    expect(within(roster()).queryByText(/yoga full/i)).not.toBeInTheDocument()
  })

  it('marks a class FULL when confirmed bookings reach capacity', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, 'Yoga', '2')
    await nav(u, 'Bookings')
    await book(u, 'Yoga', 'Alice')
    await book(u, 'Yoga', 'Bob')
    await nav(u, 'Roster')
    expect(within(roster()).getByText(/yoga: 2\/2 booked/i)).toBeInTheDocument()
    expect(within(roster()).getByText(/yoga full/i)).toBeInTheDocument()
  })

  it('waitlists a booking once capacity is reached', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, 'Yoga', '1')
    await nav(u, 'Bookings')
    await book(u, 'Yoga', 'Alice')
    await book(u, 'Yoga', 'Bob')
    expect(screen.getByText('Alice - Yoga')).toBeInTheDocument()
    expect(screen.getByText('Bob - Yoga (waitlisted)')).toBeInTheDocument()
  })

  it('shows a waitlist count in the roster', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, 'Yoga', '1')
    await nav(u, 'Bookings')
    await book(u, 'Yoga', 'Alice')
    await book(u, 'Yoga', 'Bob')
    await nav(u, 'Roster')
    expect(within(roster()).getByText(/yoga: 1\/1 booked/i)).toBeInTheDocument()
    expect(within(roster()).getByText(/yoga waitlist: 1/i)).toBeInTheDocument()
  })

  it('promotes the earliest waitlisted member when a confirmed booking is cancelled', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, 'Yoga', '1')
    await nav(u, 'Bookings')
    await book(u, 'Yoga', 'Alice')
    await book(u, 'Yoga', 'Bob')
    await u.click(screen.getByRole('button', { name: 'Cancel Alice' }))
    expect(screen.getByText('Bob - Yoga')).toBeInTheDocument()
    expect(screen.queryByText('Bob - Yoga (waitlisted)')).not.toBeInTheDocument()
  })

  it('does not promote when a waitlisted booking is cancelled', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, 'Yoga', '1')
    await nav(u, 'Bookings')
    await book(u, 'Yoga', 'Alice')
    await book(u, 'Yoga', 'Bob')
    await book(u, 'Yoga', 'Carol')
    await u.click(screen.getByRole('button', { name: 'Cancel Bob' }))
    expect(screen.getByText('Carol - Yoga (waitlisted)')).toBeInTheDocument()
    expect(screen.getByText('Alice - Yoga')).toBeInTheDocument()
  })

  it('tracks two classes independently in the roster', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, 'Yoga', '2')
    await addClass(u, 'Spin', '1')
    await nav(u, 'Bookings')
    await book(u, 'Yoga', 'Alice')
    await book(u, 'Spin', 'Bob')
    await nav(u, 'Roster')
    expect(within(roster()).getByText(/yoga: 1\/2 booked/i)).toBeInTheDocument()
    expect(within(roster()).getByText(/spin: 1\/1 booked/i)).toBeInTheDocument()
    expect(within(roster()).getByText(/spin full/i)).toBeInTheDocument()
  })

  it('toggles theme via data-theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Roster')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hides full classes from the roster when the setting is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, 'Yoga', '1')
    await addClass(u, 'Spin', '3')
    await nav(u, 'Bookings')
    await book(u, 'Yoga', 'Alice')
    await book(u, 'Spin', 'Bob')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide full classes/i))
    await nav(u, 'Roster')
    expect(within(roster()).queryByText(/yoga:/i)).not.toBeInTheDocument()
    expect(within(roster()).getByText(/spin: 1\/3 booked/i)).toBeInTheDocument()
  })

  it('keeps a full hidden class counting elsewhere (still bookable, still waitlists)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClass(u, 'Yoga', '1')
    await nav(u, 'Bookings')
    await book(u, 'Yoga', 'Alice')
    await book(u, 'Yoga', 'Bob')
    expect(screen.getByText('Bob - Yoga (waitlisted)')).toBeInTheDocument()
  })
})

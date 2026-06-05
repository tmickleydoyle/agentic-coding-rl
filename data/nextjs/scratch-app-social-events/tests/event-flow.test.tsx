import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('event flow', () => {
  it('lists seeded events with attendee counts', () => {
    render(<App />)
    const list = screen.getByTestId('event-list')
    expect(within(list).getByTestId('event-e1-title')).toHaveTextContent('Park Cleanup')
    // e1: going 8 + own rsvp going (+1) => 9
    expect(screen.getByTestId('event-e1-count')).toHaveTextContent('9')
    // e3: going 12 + own rsvp maybe (+0) => 12
    expect(screen.getByTestId('event-e3-count')).toHaveTextContent('12')
  })

  it('marks events upcoming or past relative to NOW', () => {
    render(<App />)
    expect(screen.getByTestId('event-e1')).toHaveAttribute('data-upcoming', 'true') // day 120
    expect(screen.getByTestId('event-e2')).toHaveAttribute('data-upcoming', 'false') // day 90
  })

  it('filters events to upcoming only', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('time-filter'), 'upcoming')
    expect(screen.getByTestId('event-e1')).toBeInTheDocument()
    expect(screen.getByTestId('event-e3')).toBeInTheDocument()
    expect(screen.queryByTestId('event-e2')).not.toBeInTheDocument()
  })

  it('filters events to past only', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('time-filter'), 'past')
    expect(screen.getByTestId('event-e2')).toBeInTheDocument()
    expect(screen.queryByTestId('event-e1')).not.toBeInTheDocument()
  })

  it('opens an event detail and shows the current RSVP', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e2'))
    expect(screen.getByTestId('page-event-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Book Club')
    expect(screen.getByTestId('detail-rsvp')).toHaveTextContent('none')
  })

  it('rsvps going and bumps the attendee count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e2'))
    expect(screen.getByTestId('detail-count')).toHaveTextContent('4') // going 4, no own rsvp
    await user.click(screen.getByTestId('rsvp-going'))
    expect(screen.getByTestId('detail-rsvp')).toHaveTextContent('going')
    expect(screen.getByTestId('detail-count')).toHaveTextContent('5')
  })

  it('changing an RSVP from going to maybe lowers the count again', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    expect(screen.getByTestId('detail-count')).toHaveTextContent('9') // going + own going
    await user.click(screen.getByTestId('rsvp-maybe'))
    expect(screen.getByTestId('detail-rsvp')).toHaveTextContent('maybe')
    expect(screen.getByTestId('detail-count')).toHaveTextContent('8')
  })

  it('blocks creating an event with an empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.click(screen.getByTestId('submit-event'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-create')).toBeInTheDocument()
  })

  it('creates an event and shows it in the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('title-input'), 'Game Night')
    await user.type(screen.getByTestId('day-input'), '140')
    await user.click(screen.getByTestId('submit-event'))
    expect(screen.getByTestId('page-events')).toBeInTheDocument()
    expect(screen.getByTestId('event-e4-title')).toHaveTextContent('Game Night')
    expect(screen.getByTestId('event-e4')).toHaveAttribute('data-upcoming', 'true')
  })
})

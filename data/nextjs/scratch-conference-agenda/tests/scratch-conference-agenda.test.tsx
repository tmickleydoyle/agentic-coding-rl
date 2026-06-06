import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Conference Agenda', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /conference agenda/i })).toBeInTheDocument()
  })

  it('shows total sessions count', () => {
    render(<App />)
    expect(screen.getByTestId('total-sessions')).toHaveTextContent('Total Sessions: 5')
  })

  it('shows keynote and workshop counts', () => {
    render(<App />)
    expect(screen.getByTestId('keynote-count')).toHaveTextContent('Keynotes: 2')
    expect(screen.getByTestId('workshop-count')).toHaveTextContent('Workshops: 1')
  })

  it('shows day 1 sessions by default', () => {
    render(<App />)
    expect(screen.getByTestId('day-session-count')).toHaveTextContent('3 sessions')
    expect(screen.getByTestId('session-1')).toBeInTheDocument()
    expect(screen.getByTestId('session-2')).toBeInTheDocument()
    expect(screen.getByTestId('session-3')).toBeInTheDocument()
  })

  it('switches to day 2 sessions', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('day-tab-2'))
    expect(screen.getByTestId('day-session-count')).toHaveTextContent('2 sessions')
    expect(screen.getByTestId('session-4')).toBeInTheDocument()
    expect(screen.getByTestId('session-5')).toBeInTheDocument()
    expect(screen.queryByTestId('session-1')).not.toBeInTheDocument()
  })

  it('shows session details', () => {
    render(<App />)
    expect(screen.getByTestId('room-1')).toHaveTextContent('Main Stage')
    expect(screen.getByTestId('time-1')).toHaveTextContent('09:00')
    expect(screen.getByTestId('duration-1')).toHaveTextContent('60m')
    expect(screen.getByTestId('type-1')).toHaveTextContent('keynote')
  })

  it('filters sessions by room', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/filter by room/i), 'Room A')
    expect(screen.getByTestId('day-session-count')).toHaveTextContent('1 sessions')
    expect(screen.getByTestId('session-2')).toBeInTheDocument()
    expect(screen.queryByTestId('session-1')).not.toBeInTheDocument()
  })

  it('removes a session', async () => {
    const user = userEvent.setup()
    render(<App />)
    const session1 = screen.getByTestId('session-1')
    await user.click(within(session1).getByRole('button', { name: /remove/i }))
    expect(screen.queryByTestId('session-1')).not.toBeInTheDocument()
    expect(screen.getByTestId('total-sessions')).toHaveTextContent('Total Sessions: 4')
  })

  it('adds a session to day 1', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/session title/i), 'New Talk')
    await user.type(screen.getByLabelText(/^speaker$/i), 'Jane Doe')
    await user.selectOptions(screen.getByLabelText(/^room$/i), 'Room B')
    await user.type(screen.getByLabelText(/start time/i), '13:00')
    await user.type(screen.getByLabelText(/duration \(minutes\)/i), '30')
    await user.selectOptions(screen.getByLabelText(/session type/i), 'talk')
    await user.selectOptions(screen.getByLabelText(/^day$/i), 'Day 1 - Sept 15')
    await user.click(screen.getByRole('button', { name: /add session/i }))
    expect(screen.getByTestId('total-sessions')).toHaveTextContent('Total Sessions: 6')
    expect(screen.getByTestId('day-session-count')).toHaveTextContent('4 sessions')
  })

  it('clears form fields after adding session', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/session title/i), 'Clear Test')
    await user.type(screen.getByLabelText(/^speaker$/i), 'Tester')
    await user.type(screen.getByLabelText(/start time/i), '15:00')
    await user.type(screen.getByLabelText(/duration \(minutes\)/i), '30')
    await user.click(screen.getByRole('button', { name: /add session/i }))
    expect(screen.getByLabelText(/session title/i)).toHaveValue('')
    expect(screen.getByLabelText(/^speaker$/i)).toHaveValue('')
    expect(screen.getByLabelText(/start time/i)).toHaveValue('')
  })

  it('does not add session with empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^speaker$/i), 'No Title')
    await user.type(screen.getByLabelText(/start time/i), '16:00')
    await user.type(screen.getByLabelText(/duration \(minutes\)/i), '30')
    await user.click(screen.getByRole('button', { name: /add session/i }))
    expect(screen.getByTestId('total-sessions')).toHaveTextContent('Total Sessions: 5')
  })

  it('adds session to day 2 and shows on day 2 tab', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/session title/i), 'Day 2 Talk')
    await user.type(screen.getByLabelText(/^speaker$/i), 'Someone')
    await user.type(screen.getByLabelText(/start time/i), '14:00')
    await user.type(screen.getByLabelText(/duration \(minutes\)/i), '45')
    await user.selectOptions(screen.getByLabelText(/^day$/i), 'Day 2 - Sept 16')
    await user.click(screen.getByRole('button', { name: /add session/i }))
    await user.click(screen.getByTestId('day-tab-2'))
    expect(screen.getByTestId('day-session-count')).toHaveTextContent('3 sessions')
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Speaker Schedule', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /speaker schedule/i })).toBeInTheDocument()
  })

  it('shows total speakers', () => {
    render(<App />)
    expect(screen.getByTestId('total-speakers')).toHaveTextContent('Total Speakers: 5')
  })

  it('shows assigned and unassigned counts', () => {
    render(<App />)
    expect(screen.getByTestId('assigned-count')).toHaveTextContent('Assigned: 2')
    expect(screen.getByTestId('unassigned-count')).toHaveTextContent('Unassigned: 3')
  })

  it('shows assigned speakers in speaker list', () => {
    render(<App />)
    expect(screen.getByTestId('speaker-1')).toBeInTheDocument()
    expect(screen.getByTestId('speaker-3')).toBeInTheDocument()
  })

  it('shows unassigned speakers in unassigned section', () => {
    render(<App />)
    expect(screen.getByTestId('unassigned-2')).toBeInTheDocument()
    expect(screen.getByTestId('unassigned-4')).toBeInTheDocument()
    expect(screen.getByTestId('unassigned-5')).toBeInTheDocument()
  })

  it('shows speaker details', () => {
    render(<App />)
    expect(screen.getByTestId('duration-1')).toHaveTextContent('45m')
    expect(screen.getByTestId('track-1')).toHaveTextContent('AI')
    expect(screen.getByTestId('slot-1')).toHaveTextContent('09:00')
  })

  it('shows all 5 speakers by default', () => {
    render(<App />)
    expect(screen.getByTestId('showing-count')).toHaveTextContent('Showing 5 speakers')
  })

  it('filters speakers by track', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/filter by track/i), 'Engineering')
    expect(screen.getByTestId('showing-count')).toHaveTextContent('Showing 2 speakers')
    expect(screen.queryByTestId('speaker-1')).not.toBeInTheDocument()
  })

  it('assigns a speaker to a time slot', async () => {
    const user = userEvent.setup()
    render(<App />)
    const unassigned2 = screen.getByTestId('unassigned-2')
    await user.selectOptions(within(unassigned2).getByLabelText(/assign slot for bob martinez/i), '10:00')
    await user.click(within(unassigned2).getByRole('button', { name: /^assign$/i }))
    expect(screen.getByTestId('assigned-count')).toHaveTextContent('Assigned: 3')
    expect(screen.getByTestId('slot-2')).toHaveTextContent('10:00')
  })

  it('does not assign to already taken time slot', async () => {
    const user = userEvent.setup()
    render(<App />)
    const unassigned2 = screen.getByTestId('unassigned-2')
    await user.selectOptions(within(unassigned2).getByLabelText(/assign slot for bob martinez/i), '09:00')
    await user.click(within(unassigned2).getByRole('button', { name: /^assign$/i }))
    expect(screen.getByTestId('assigned-count')).toHaveTextContent('Assigned: 2')
  })

  it('does not assign when no slot selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    const unassigned4 = screen.getByTestId('unassigned-4')
    await user.click(within(unassigned4).getByRole('button', { name: /^assign$/i }))
    expect(screen.getByTestId('assigned-count')).toHaveTextContent('Assigned: 2')
  })

  it('unassigns a speaker', async () => {
    const user = userEvent.setup()
    render(<App />)
    const speaker1 = screen.getByTestId('speaker-1')
    await user.click(within(speaker1).getByRole('button', { name: /unassign/i }))
    expect(screen.getByTestId('assigned-count')).toHaveTextContent('Assigned: 1')
    expect(screen.getByTestId('unassigned-count')).toHaveTextContent('Unassigned: 4')
    expect(screen.queryByTestId('speaker-1')).not.toBeInTheDocument()
    expect(screen.getByTestId('unassigned-1')).toBeInTheDocument()
  })

  it('reassigns speaker to different slot', async () => {
    const user = userEvent.setup()
    render(<App />)
    const speaker1 = screen.getByTestId('speaker-1')
    await user.selectOptions(within(speaker1).getByLabelText(/time slot for dr\. alice chen/i), '11:00')
    expect(screen.getByTestId('slot-1')).toHaveTextContent('11:00')
  })
})

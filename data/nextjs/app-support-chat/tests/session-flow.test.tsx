import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('session flow', () => {
  it('queue lists only waiting sessions', () => {
    render(<App />)
    const list = screen.getByTestId('queue-list')
    expect(within(list).getByTestId('session-s1')).toBeInTheDocument()
    expect(within(list).getByTestId('session-s4')).toBeInTheDocument()
    expect(within(list).queryByTestId('session-s2')).not.toBeInTheDocument()
    expect(within(list).queryByTestId('session-s3')).not.toBeInTheDocument()
  })

  it('shows a no-selection message before opening', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-session'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('opens a session and shows its transcript', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s1'))
    expect(screen.getByTestId('page-session')).toBeInTheDocument()
    expect(screen.getByTestId('detail-visitor')).toHaveTextContent('dana')
    expect(screen.getByTestId('detail-topic')).toHaveTextContent('Cannot check out')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('waiting')
    const transcript = screen.getByTestId('transcript')
    expect(within(transcript).getByText('Hi, my cart is stuck.')).toBeInTheDocument()
  })

  it('assigning an agent moves the session to active', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s1'))
    expect(screen.getByTestId('detail-agent')).toHaveTextContent('Unassigned')
    await user.selectOptions(screen.getByTestId('agent-select'), 'carol')
    await user.click(screen.getByTestId('assign-btn'))
    expect(screen.getByTestId('detail-agent')).toHaveTextContent('carol')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('active')
  })

  it('an assigned session leaves the queue', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s1'))
    await user.click(screen.getByTestId('assign-btn'))
    await user.click(screen.getByTestId('nav-queue'))
    const list = screen.getByTestId('queue-list')
    expect(within(list).queryByTestId('session-s1')).not.toBeInTheDocument()
    expect(within(list).getByTestId('session-s4')).toBeInTheDocument()
  })

  it('closing a session moves it to history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s1'))
    await user.click(screen.getByTestId('close-btn'))
    expect(screen.getByTestId('detail-status')).toHaveTextContent('closed')
    await user.click(screen.getByTestId('nav-history'))
    const list = screen.getByTestId('history-list')
    expect(within(list).getByTestId('session-s1')).toBeInTheDocument()
  })

  it('sends a message into the transcript', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s4'))
    await user.type(screen.getByTestId('message-input'), 'Hello there')
    await user.click(screen.getByTestId('send-btn'))
    const transcript = screen.getByTestId('transcript')
    expect(within(transcript).getByText('Hello there')).toBeInTheDocument()
  })

  it('persists an assignment to the agents load view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s1'))
    await user.selectOptions(screen.getByTestId('agent-select'), 'bob')
    await user.click(screen.getByTestId('assign-btn'))
    await user.click(screen.getByTestId('nav-agents'))
    expect(screen.getByTestId('agent-bob-load')).toHaveTextContent('1')
  })
})

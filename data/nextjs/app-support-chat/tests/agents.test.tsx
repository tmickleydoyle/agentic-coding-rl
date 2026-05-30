import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('history and agents', () => {
  it('history lists only closed sessions', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    const list = screen.getByTestId('history-list')
    expect(within(list).getByTestId('session-s3')).toBeInTheDocument()
    expect(within(list).queryByTestId('session-s1')).not.toBeInTheDocument()
    expect(within(list).queryByTestId('session-s2')).not.toBeInTheDocument()
  })

  it('shows active session load per agent', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-agents'))
    expect(screen.getByTestId('agent-alice-load')).toHaveTextContent('2')
    expect(screen.getByTestId('agent-bob-load')).toHaveTextContent('0')
    expect(screen.getByTestId('agent-carol-load')).toHaveTextContent('0')
  })

  it('shows an empty-history message once all closed sessions are removed is not needed; queue empties as waiting sessions are assigned', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s1'))
    await user.click(screen.getByTestId('assign-btn'))
    await user.click(screen.getByTestId('nav-queue'))
    await user.click(screen.getByTestId('open-s4'))
    await user.click(screen.getByTestId('assign-btn'))
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.getByTestId('empty-queue')).toBeInTheDocument()
  })

  it('reflects a newly closed active session in counts after assign+close', async () => {
    const user = userEvent.setup()
    render(<App />)
    // assign s1 to carol -> carol load 1, then close -> carol load 0
    await user.click(screen.getByTestId('open-s1'))
    await user.selectOptions(screen.getByTestId('agent-select'), 'carol')
    await user.click(screen.getByTestId('assign-btn'))
    await user.click(screen.getByTestId('nav-agents'))
    expect(screen.getByTestId('agent-carol-load')).toHaveTextContent('1')
    await user.click(screen.getByTestId('nav-history'))
    // not yet closed; go back to session via queue is gone. Re-open from nav-session.
    await user.click(screen.getByTestId('nav-session'))
    await user.click(screen.getByTestId('close-btn'))
    await user.click(screen.getByTestId('nav-agents'))
    expect(screen.getByTestId('agent-carol-load')).toHaveTextContent('0')
  })
})

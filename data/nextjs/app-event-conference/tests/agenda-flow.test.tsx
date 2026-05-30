import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('agenda flow', () => {
  it('shows the seeded agenda with one session', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-agenda'))
    expect(screen.getByTestId('agenda-s1')).toBeInTheDocument()
    expect(screen.getByTestId('agenda-count')).toHaveTextContent('1')
  })

  it('adds a non-conflicting session to the agenda', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-s2')) // slot 10:00, no conflict
    await user.click(screen.getByTestId('add-btn'))
    await user.click(screen.getByTestId('nav-my-agenda'))
    expect(screen.getByTestId('agenda-s2')).toBeInTheDocument()
    expect(screen.getByTestId('agenda-count')).toHaveTextContent('2')
  })

  it('blocks adding a session that conflicts on the slot', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-s3')) // slot 09:00 conflicts with s1
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('conflict-error')).toBeInTheDocument()
    expect(screen.getByTestId('conflict-with')).toHaveTextContent('s1')
  })

  it('shows a remove button for a session already in the agenda', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-s1'))
    expect(screen.getByTestId('remove-btn')).toBeInTheDocument()
    expect(screen.queryByTestId('add-btn')).not.toBeInTheDocument()
  })

  it('removes a session from the agenda via the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-s1'))
    await user.click(screen.getByTestId('remove-btn'))
    await user.click(screen.getByTestId('nav-my-agenda'))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('agenda-list')).not.toBeInTheDocument()
  })

  it('drops a session from the my-agenda list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-agenda'))
    await user.click(screen.getByTestId('drop-s1'))
    expect(screen.queryByTestId('agenda-s1')).not.toBeInTheDocument()
    expect(screen.getByTestId('agenda-count')).toHaveTextContent('0')
  })

  it('frees the slot after removing a conflicting session', async () => {
    const user = userEvent.setup()
    render(<App />)
    // drop s1 (09:00) then s3 (09:00) should add cleanly
    await user.click(screen.getByTestId('nav-my-agenda'))
    await user.click(screen.getByTestId('drop-s1'))
    await user.click(screen.getByTestId('nav-schedule'))
    await user.click(screen.getByTestId('view-s3'))
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.queryByTestId('conflict-error')).not.toBeInTheDocument()
    await user.click(screen.getByTestId('nav-my-agenda'))
    expect(screen.getByTestId('agenda-s3')).toBeInTheDocument()
  })
})

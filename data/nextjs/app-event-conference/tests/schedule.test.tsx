import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('schedule view', () => {
  it('lists all sessions with details', () => {
    render(<App />)
    expect(screen.getByTestId('session-s1-title')).toHaveTextContent('Intro to RL')
    expect(screen.getByTestId('session-s1-slot')).toHaveTextContent('09:00')
    expect(screen.getByTestId('session-s4-title')).toHaveTextContent('GPU Tuning')
  })

  it('filters sessions by track', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('track-filter'), 'AI')
    expect(screen.getByTestId('session-s1')).toBeInTheDocument()
    expect(screen.getByTestId('session-s4')).toBeInTheDocument()
    expect(screen.queryByTestId('session-s2')).not.toBeInTheDocument()
  })

  it('selecting a session opens its detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-s2'))
    expect(screen.getByTestId('page-session-detail')).toBeInTheDocument()
    expect(screen.getByTestId('session-title')).toHaveTextContent('Vector DBs')
  })

  it('shows no-session when navigating to detail without a selection', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-session-detail'))
    expect(screen.getByTestId('no-session')).toBeInTheDocument()
  })
})

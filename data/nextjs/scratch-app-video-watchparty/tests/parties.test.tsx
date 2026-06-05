import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('parties list + filter', () => {
  it('defaults to upcoming and lists only upcoming parties', () => {
    render(<App />)
    expect(screen.getByTestId('current-filter')).toHaveTextContent('upcoming')
    expect(screen.getByTestId('filter-upcoming')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('party-p1-title')).toHaveTextContent('React Conf Replay')
    expect(screen.getByTestId('party-p3-title')).toHaveTextContent('CSS Showcase')
    expect(screen.queryByTestId('party-p2')).not.toBeInTheDocument()
  })

  it('shows the status label per party', () => {
    render(<App />)
    expect(screen.getByTestId('party-p1-status')).toHaveTextContent('upcoming')
  })

  it('switching to past shows past parties only', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('filter-past'))
    expect(screen.getByTestId('current-filter')).toHaveTextContent('past')
    expect(screen.getByTestId('party-p2-title')).toHaveTextContent('Design Systems Live')
    expect(screen.getByTestId('party-p2-status')).toHaveTextContent('past')
    expect(screen.queryByTestId('party-p1')).not.toBeInTheDocument()
  })

  it('opens a party to its detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-p1'))
    expect(screen.getByTestId('page-party-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('React Conf Replay')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('upcoming')
  })
})

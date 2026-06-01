import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('show detail flow', () => {
  it('shows episodes and the played count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-sh1'))
    expect(screen.getByTestId('ep-e1-title')).toHaveTextContent('Intro')
    expect(screen.getByTestId('played-e1')).toHaveTextContent('played')
    expect(screen.getByTestId('played-e2')).toHaveTextContent('unplayed')
    expect(screen.getByTestId('detail-played-count')).toHaveTextContent('1')
  })

  it('marks an episode played and updates the count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-sh1'))
    await user.click(screen.getByTestId('toggle-played-e2'))
    expect(screen.getByTestId('played-e2')).toHaveTextContent('played')
    expect(screen.getByTestId('detail-played-count')).toHaveTextContent('2')
  })

  it('marks a played episode unplayed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-sh1'))
    await user.click(screen.getByTestId('toggle-played-e1'))
    expect(screen.getByTestId('played-e1')).toHaveTextContent('unplayed')
    expect(screen.getByTestId('detail-played-count')).toHaveTextContent('0')
  })

  it('enqueues an episode to the up-next queue', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-sh1'))
    await user.click(screen.getByTestId('enqueue-e2'))
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.getByTestId('q-ep-e2')).toBeInTheDocument()
  })

  it('played state persists across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-sh2'))
    await user.click(screen.getByTestId('toggle-played-e3'))
    await user.click(screen.getByTestId('nav-shows'))
    await user.click(screen.getByTestId('open-sh2'))
    expect(screen.getByTestId('played-e3')).toHaveTextContent('played')
  })
})

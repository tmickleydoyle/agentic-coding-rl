import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('breaches and dashboard', () => {
  it('lists only currently-breached tickets', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-breaches'))
    const list = screen.getByTestId('breach-list')
    expect(within(list).getByTestId('breach-k1')).toBeInTheDocument()
    expect(within(list).getByTestId('breach-k3')).toBeInTheDocument()
    expect(within(list).getByTestId('breach-k5')).toBeInTheDocument()
    expect(within(list).queryByTestId('breach-k2')).not.toBeInTheDocument()
    expect(within(list).queryByTestId('breach-k4')).not.toBeInTheDocument()
  })

  it('removes a ticket from breaches after responding', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-breaches'))
    await user.click(screen.getByTestId('open-k1'))
    await user.click(screen.getByTestId('respond-btn'))
    await user.click(screen.getByTestId('nav-breaches'))
    const list = screen.getByTestId('breach-list')
    expect(within(list).queryByTestId('breach-k1')).not.toBeInTheDocument()
    expect(within(list).getByTestId('breach-k3')).toBeInTheDocument()
  })

  it('shows the dashboard counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('5')
    expect(screen.getByTestId('stat-breached-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-responded-value')).toHaveTextContent('1')
    expect(screen.getByTestId('stat-escalated-value')).toHaveTextContent('0')
  })

  it('updates the dashboard counts after escalating', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-k1'))
    await user.click(screen.getByTestId('escalate-btn'))
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('stat-escalated-value')).toHaveTextContent('1')
  })

  it('shows a no-breaches message when all breaches are responded', async () => {
    const user = userEvent.setup()
    render(<App />)
    const ids = ['k1', 'k3', 'k5']
    for (let i = 0; i < ids.length; i += 1) {
      await user.click(screen.getByTestId('nav-tickets'))
      await user.click(screen.getByTestId(`open-${ids[i]}`))
      await user.click(screen.getByTestId('respond-btn'))
    }
    await user.click(screen.getByTestId('nav-breaches'))
    expect(screen.getByTestId('no-breaches')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BadgeCount from '../components/BadgeCount'

describe('BadgeCount', () => {
  it('hides badge when count is 0', () => {
    render(<BadgeCount />)
    expect(screen.queryByTestId('badge')).toBeNull()
  })

  it('shows badge after add', async () => {
    const user = userEvent.setup()
    render(<BadgeCount />)
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('badge')).toHaveTextContent('1')
  })

  it('increments count on multiple adds', async () => {
    const user = userEvent.setup()
    render(<BadgeCount />)
    await user.click(screen.getByTestId('add-btn'))
    await user.click(screen.getByTestId('add-btn'))
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('badge')).toHaveTextContent('3')
  })

  it('clears badge to 0 and hides it', async () => {
    const user = userEvent.setup()
    render(<BadgeCount />)
    await user.click(screen.getByTestId('add-btn'))
    await user.click(screen.getByTestId('clear-btn'))
    expect(screen.queryByTestId('badge')).toBeNull()
  })

  it('badge reappears after clear and add', async () => {
    const user = userEvent.setup()
    render(<BadgeCount />)
    await user.click(screen.getByTestId('add-btn'))
    await user.click(screen.getByTestId('clear-btn'))
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('badge')).toHaveTextContent('1')
  })

  it('clear with count 0 keeps badge hidden', async () => {
    const user = userEvent.setup()
    render(<BadgeCount />)
    await user.click(screen.getByTestId('clear-btn'))
    expect(screen.queryByTestId('badge')).toBeNull()
  })
})

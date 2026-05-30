import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('focus list', () => {
  it('lists only the do-quadrant tasks', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-focus-list'))
    expect(screen.getByTestId('focus-t1')).toBeInTheDocument() // Fix outage
    expect(screen.queryByTestId('focus-t2')).not.toBeInTheDocument()
    expect(screen.getByTestId('focus-count')).toHaveTextContent('1')
  })

  it('grows when another task is moved into the do quadrant', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('do-t2')) // Plan roadmap schedule -> do
    await user.click(screen.getByTestId('nav-focus-list'))
    expect(screen.getByTestId('focus-t1')).toBeInTheDocument()
    expect(screen.getByTestId('focus-t2')).toBeInTheDocument()
    expect(screen.getByTestId('focus-count')).toHaveTextContent('2')
  })

  it('shows an empty state when the do quadrant is cleared', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('schedule-t1')) // move the only do task out
    await user.click(screen.getByTestId('nav-focus-list'))
    expect(screen.getByTestId('empty-focus')).toBeInTheDocument()
    expect(screen.queryByTestId('focus-list')).not.toBeInTheDocument()
    expect(screen.getByTestId('focus-count')).toHaveTextContent('0')
  })
})

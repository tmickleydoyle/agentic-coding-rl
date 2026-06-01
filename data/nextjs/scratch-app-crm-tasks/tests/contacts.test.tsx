import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('per-contact grouping and done view', () => {
  it('shows open and total follow-up counts per contact', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-contacts'))
    // c1 (Ada): t1, t3 both open -> open 2 total 2
    expect(screen.getByTestId('contact-c1-open')).toHaveTextContent('2')
    expect(screen.getByTestId('contact-c1-total')).toHaveTextContent('2')
    // c2 (Grace): t2 open, t4 done -> open 1 total 2
    expect(screen.getByTestId('contact-c2-open')).toHaveTextContent('1')
    expect(screen.getByTestId('contact-c2-total')).toHaveTextContent('2')
    // c3 (Linus): none
    expect(screen.getByTestId('contact-c3-total')).toHaveTextContent('0')
  })

  it('per-contact counts update after completing a task', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tasks'))
    await user.click(screen.getByTestId('toggle-t1'))
    await user.click(screen.getByTestId('nav-contacts'))
    expect(screen.getByTestId('contact-c1-open')).toHaveTextContent('1')
    expect(screen.getByTestId('contact-c1-total')).toHaveTextContent('2')
  })

  it('lists completed tasks on the done page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-done'))
    expect(screen.getByTestId('done-count')).toHaveTextContent('1')
    expect(screen.getByTestId('task-t4')).toBeInTheDocument()
  })

  it('reopening a done task moves it back to open', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-done'))
    await user.click(screen.getByTestId('toggle-t4'))
    expect(screen.getByTestId('done-count')).toHaveTextContent('0')
    expect(screen.getByTestId('done-empty')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-tasks'))
    expect(screen.getByTestId('task-t4')).toBeInTheDocument()
  })

  it('removing a task drops it from the open list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tasks'))
    await user.click(screen.getByTestId('remove-t3'))
    expect(screen.queryByTestId('task-t3')).not.toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('enroll + waitlist flow', () => {
  it('blocks enrolling with an empty student name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    await user.click(screen.getByTestId('enroll-submit'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('enrolls a student into a class with room', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1')) // Yoga 1/2 enrolled
    await user.type(screen.getByTestId('student-input'), 'Linus')
    await user.click(screen.getByTestId('enroll-submit'))
    expect(screen.getByTestId('detail-enrolled')).toHaveTextContent('2')
    await user.click(screen.getByTestId('nav-my-classes'))
    expect(within(screen.getByTestId('enrolled-list')).getByText('Linus')).toBeInTheDocument()
  })

  it('shows the full notice and waitlists when the class is full', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c2')) // Pottery, capacity 1, full
    expect(screen.getByTestId('detail-full')).toBeInTheDocument()
    await user.type(screen.getByTestId('student-input'), 'Margaret')
    await user.click(screen.getByTestId('enroll-submit'))
    // still full, enrolled count unchanged
    expect(screen.getByTestId('detail-enrolled')).toHaveTextContent('1')
    await user.click(screen.getByTestId('nav-waitlist'))
    expect(within(screen.getByTestId('waitlist-list')).getByText('Margaret')).toBeInTheDocument()
  })

  it('my-classes shows only enrolled, not waitlisted', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-classes'))
    // Ada (e1) and Grace (e2) are enrolled; Hedy (e3) is waitlisted
    expect(screen.getByTestId('enrollment-e1')).toBeInTheDocument()
    expect(screen.getByTestId('enrollment-e2')).toBeInTheDocument()
    expect(screen.queryByTestId('enrollment-e3')).not.toBeInTheDocument()
  })

  it('waitlist shows only waitlisted students', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-waitlist'))
    expect(screen.getByTestId('waitlisted-e3')).toBeInTheDocument()
    expect(screen.queryByTestId('waitlisted-e1')).not.toBeInTheDocument()
  })

  it('promotes the waitlisted student when an enrolled one cancels', async () => {
    const user = userEvent.setup()
    render(<App />)
    // Cancel Grace (e2, enrolled in Pottery c2) — Hedy (e3) should be promoted
    await user.click(screen.getByTestId('nav-my-classes'))
    await user.click(screen.getByTestId('cancel-e2'))
    // Hedy now enrolled, appears in my-classes
    expect(screen.getByTestId('enrollment-e3')).toBeInTheDocument()
    // and no longer on the waitlist
    await user.click(screen.getByTestId('nav-waitlist'))
    expect(screen.getByTestId('waitlist-empty')).toBeInTheDocument()
  })

  it('cancelling a waitlisted student does not promote anyone', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-waitlist'))
    await user.click(screen.getByTestId('cancel-e3'))
    expect(screen.getByTestId('waitlist-empty')).toBeInTheDocument()
    // Grace stays enrolled, still 1 enrolled in Pottery
    await user.click(screen.getByTestId('nav-classes'))
    expect(screen.getByTestId('class-c2-enrolled')).toHaveTextContent('1')
  })

  it('shows the empty state when all enrolled classes are cancelled', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-classes'))
    await user.click(screen.getByTestId('cancel-e1')) // Ada / Yoga
    // Cancelling Grace promotes Hedy, so cancel that too
    await user.click(screen.getByTestId('cancel-e2'))
    await user.click(screen.getByTestId('cancel-e3'))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('enrolled-list')).not.toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function openC1(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('open-c1'))
}

describe('enroll + lesson completion flow', () => {
  it('hides the lesson list until enrolled', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openC1(user)
    expect(screen.queryByTestId('lesson-list')).not.toBeInTheDocument()
    expect(screen.getByTestId('enroll-toggle')).toHaveTextContent('Enroll')
  })

  it('enrolling reveals the lessons and flips the toggle label', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openC1(user)
    await user.click(screen.getByTestId('enroll-toggle'))
    expect(screen.getByTestId('lesson-list')).toBeInTheDocument()
    expect(screen.getByTestId('enroll-toggle')).toHaveTextContent('Unenroll')
    expect(screen.getByTestId('lesson-l1')).toHaveAttribute('data-complete', 'false')
  })

  it('toggles a lesson complete and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openC1(user)
    await user.click(screen.getByTestId('enroll-toggle'))
    await user.click(screen.getByTestId('lesson-toggle-l1'))
    expect(screen.getByTestId('lesson-l1')).toHaveAttribute('data-complete', 'true')
    await user.click(screen.getByTestId('lesson-toggle-l1'))
    expect(screen.getByTestId('lesson-l1')).toHaveAttribute('data-complete', 'false')
  })

  it('unenrolling hides the lessons again', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openC1(user)
    await user.click(screen.getByTestId('enroll-toggle')) // enroll
    await user.click(screen.getByTestId('enroll-toggle')) // unenroll
    expect(screen.queryByTestId('lesson-list')).not.toBeInTheDocument()
    expect(screen.getByTestId('enroll-toggle')).toHaveTextContent('Enroll')
  })

  it('completion percentage shows in my-courses', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openC1(user)
    await user.click(screen.getByTestId('enroll-toggle'))
    await user.click(screen.getByTestId('lesson-toggle-l1')) // 1 of 4 = 25%
    await user.click(screen.getByTestId('nav-my-courses'))
    expect(screen.getByTestId('my-course-c1-title')).toHaveTextContent('Intro to React')
    expect(screen.getByTestId('my-course-c1-percent')).toHaveTextContent('25')
  })

  it('shows no-enrollments when nothing is enrolled', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-courses'))
    expect(screen.getByTestId('no-enrollments')).toBeInTheDocument()
  })
})

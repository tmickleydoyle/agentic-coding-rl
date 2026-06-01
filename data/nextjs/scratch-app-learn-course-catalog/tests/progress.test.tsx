import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('progress aggregate', () => {
  it('starts with zero enrollments and zero percent', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-progress'))
    expect(screen.getByTestId('enrolled-count-value')).toHaveTextContent('0')
    expect(screen.getByTestId('completed-lessons-value')).toHaveTextContent('0')
    expect(screen.getByTestId('overall-percent-value')).toHaveTextContent('0')
  })

  it('aggregates completed lessons and overall percent across courses', async () => {
    const user = userEvent.setup()
    render(<App />)
    // enroll c1 (4 lessons), complete 2
    await user.click(screen.getByTestId('open-c1'))
    await user.click(screen.getByTestId('enroll-toggle'))
    await user.click(screen.getByTestId('lesson-toggle-l1'))
    await user.click(screen.getByTestId('lesson-toggle-l2'))
    // enroll c2 (2 lessons), complete 0
    await user.click(screen.getByTestId('nav-catalog'))
    await user.click(screen.getByTestId('open-c2'))
    await user.click(screen.getByTestId('enroll-toggle'))
    await user.click(screen.getByTestId('nav-progress'))
    // 2 enrollments, 2 completed lessons, total lessons 6 -> 33%
    expect(screen.getByTestId('enrolled-count-value')).toHaveTextContent('2')
    expect(screen.getByTestId('completed-lessons-value')).toHaveTextContent('2')
    expect(screen.getByTestId('overall-percent-value')).toHaveTextContent('33')
  })
})

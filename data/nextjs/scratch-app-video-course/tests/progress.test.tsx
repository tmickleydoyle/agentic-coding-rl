import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('progress aggregate', () => {
  it('starts with zero completed and correct total lessons', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-progress'))
    expect(screen.getByTestId('completed-lessons-value')).toHaveTextContent('0')
    expect(screen.getByTestId('total-lessons-value')).toHaveTextContent('6')
    expect(screen.getByTestId('overall-percent-value')).toHaveTextContent('0')
  })

  it('aggregates across courses', async () => {
    const user = userEvent.setup()
    render(<App />)
    // complete c1:l1 and c1:l2
    await user.click(screen.getByTestId('open-c1'))
    await user.click(screen.getByTestId('play-c1-l1'))
    await user.click(screen.getByTestId('complete-toggle'))
    await user.click(screen.getByTestId('nav-course-detail'))
    await user.click(screen.getByTestId('play-c1-l2'))
    await user.click(screen.getByTestId('complete-toggle'))
    await user.click(screen.getByTestId('nav-progress'))
    // 2 of 6 total = 33%
    expect(screen.getByTestId('completed-lessons-value')).toHaveTextContent('2')
    expect(screen.getByTestId('overall-percent-value')).toHaveTextContent('33')
    expect(screen.getByTestId('cp-c1-percent')).toHaveTextContent('50')
    expect(screen.getByTestId('cp-c2-percent')).toHaveTextContent('0')
  })
})

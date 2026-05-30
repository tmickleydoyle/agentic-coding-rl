import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function playC1L1(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('open-c1'))
  await user.click(screen.getByTestId('play-c1-l1'))
}

describe('player + completion flow', () => {
  it('plays a lesson and shows its title and duration', async () => {
    const user = userEvent.setup()
    render(<App />)
    await playC1L1(user)
    expect(screen.getByTestId('page-player')).toBeInTheDocument()
    expect(screen.getByTestId('player-title')).toHaveTextContent('JSX')
    expect(screen.getByTestId('player-duration')).toHaveTextContent('300')
  })

  it('marks a lesson complete and back via the toggle', async () => {
    const user = userEvent.setup()
    render(<App />)
    await playC1L1(user)
    expect(screen.queryByTestId('complete-flag')).not.toBeInTheDocument()
    expect(screen.getByTestId('complete-toggle')).toHaveTextContent('Mark complete')
    await user.click(screen.getByTestId('complete-toggle'))
    expect(screen.getByTestId('complete-flag')).toBeInTheDocument()
    expect(screen.getByTestId('complete-toggle')).toHaveTextContent('Mark incomplete')
    await user.click(screen.getByTestId('complete-toggle'))
    expect(screen.queryByTestId('complete-flag')).not.toBeInTheDocument()
  })

  it('completion reflects on the detail lesson row', async () => {
    const user = userEvent.setup()
    render(<App />)
    await playC1L1(user)
    await user.click(screen.getByTestId('complete-toggle'))
    await user.click(screen.getByTestId('nav-course-detail'))
    expect(screen.getByTestId('lesson-c1-l1')).toHaveAttribute('data-complete', 'true')
    expect(screen.getByTestId('lesson-c1-l2')).toHaveAttribute('data-complete', 'false')
  })

  it('course percent updates after completing a lesson', async () => {
    const user = userEvent.setup()
    render(<App />)
    await playC1L1(user)
    await user.click(screen.getByTestId('complete-toggle')) // 1 of 4 = 25%
    await user.click(screen.getByTestId('nav-courses'))
    expect(screen.getByTestId('course-c1-percent')).toHaveTextContent('25')
  })

  it('completion is scoped per course (c2 l1 distinct from c1 l1)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await playC1L1(user)
    await user.click(screen.getByTestId('complete-toggle')) // complete c1:l1
    await user.click(screen.getByTestId('nav-courses'))
    await user.click(screen.getByTestId('open-c2'))
    expect(screen.getByTestId('lesson-c2-l1')).toHaveAttribute('data-complete', 'false')
  })
})

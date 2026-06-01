import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('insights and goal', () => {
  it('tags each entry with its trend vs the previous entry', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('entry-g1')).toHaveAttribute('data-trend', 'same') // first
    expect(screen.getByTestId('entry-g2')).toHaveAttribute('data-trend', 'down') // 79.5 < 80
    expect(screen.getByTestId('entry-g3')).toHaveAttribute('data-trend', 'down') // 79 < 79.5
  })

  it('shows the latest trend and change from start on insights', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-insights'))
    expect(screen.getByTestId('stat-latest-value')).toHaveTextContent('79')
    expect(screen.getByTestId('stat-trend-value')).toHaveTextContent('down')
    expect(screen.getByTestId('stat-change-value')).toHaveTextContent('-1')
    expect(screen.getByTestId('stat-progress-value')).toHaveTextContent('20')
  })

  it('shows goal progress and not-reached state', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-goal'))
    expect(screen.getByTestId('current-goal')).toHaveTextContent('75')
    expect(screen.getByTestId('goal-progress')).toHaveTextContent('20')
    expect(screen.getByTestId('goal-reached')).toHaveAttribute('data-reached', 'false')
  })

  it('an up trend is detected when weight increases', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('weight-input'), '80')
    await user.click(screen.getByTestId('submit-weight'))
    await user.click(screen.getByTestId('nav-insights'))
    expect(screen.getByTestId('stat-trend-value')).toHaveTextContent('up') // 80 > 79
  })

  it('progress increases as weight approaches the goal', async () => {
    const user = userEvent.setup()
    render(<App />)
    // log 77.5: start 80, current 77.5, goal 75 => (80-77.5)/(80-75)=50%
    await user.type(screen.getByTestId('weight-input'), '77.5')
    await user.click(screen.getByTestId('submit-weight'))
    await user.click(screen.getByTestId('nav-goal'))
    expect(screen.getByTestId('goal-progress')).toHaveTextContent('50')
  })

  it('marks the goal reached when weight is at or below it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('weight-input'), '75')
    await user.click(screen.getByTestId('submit-weight'))
    await user.click(screen.getByTestId('nav-goal'))
    expect(screen.getByTestId('goal-reached')).toHaveAttribute('data-reached', 'true')
    expect(screen.getByTestId('goal-progress')).toHaveTextContent('100')
  })

  it('updates the goal on the goal page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-goal'))
    await user.clear(screen.getByTestId('goal-input'))
    await user.type(screen.getByTestId('goal-input'), '70')
    await user.click(screen.getByTestId('submit-goal'))
    expect(screen.getByTestId('current-goal')).toHaveTextContent('70')
  })

  it('rejects a non-positive goal', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-goal'))
    await user.clear(screen.getByTestId('goal-input'))
    await user.type(screen.getByTestId('goal-input'), '-5')
    await user.click(screen.getByTestId('submit-goal'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('current-goal')).toHaveTextContent('75')
  })
})

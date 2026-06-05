import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('goals list and detail', () => {
  it('lists only active goals with progress', () => {
    render(<App />)
    expect(screen.getByTestId('goal-g1-name')).toHaveTextContent('Run a 5K')
    expect(screen.getByTestId('goal-g1-progress')).toHaveTextContent('50')
    // g2 is complete -> not in active list
    expect(screen.queryByTestId('goal-g2')).not.toBeInTheDocument()
  })

  it('opens goal detail when a goal is viewed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g1'))
    expect(screen.getByTestId('page-goal-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Run a 5K')
    expect(screen.getByTestId('detail-progress')).toHaveTextContent('50')
    expect(screen.getByTestId('detail-days-left')).toHaveTextContent('33')
  })

  it('lists the milestones with their done flags', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g1'))
    expect(screen.getByTestId('ms-g1-m1')).toHaveAttribute('data-done', 'true')
    expect(screen.getByTestId('ms-g1-m3')).toHaveAttribute('data-done', 'false')
  })

  it('toggling a milestone updates progress', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g1'))
    await user.click(screen.getByTestId('toggle-ms-g1-m3'))
    expect(screen.getByTestId('ms-g1-m3')).toHaveAttribute('data-done', 'true')
    // 3/4 done now => 75
    expect(screen.getByTestId('detail-progress')).toHaveTextContent('75')
  })

  it('completing all milestones moves a goal out of active and into completed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g1'))
    await user.click(screen.getByTestId('toggle-ms-g1-m3'))
    await user.click(screen.getByTestId('toggle-ms-g1-m4'))
    expect(screen.getByTestId('detail-progress')).toHaveTextContent('100')
    await user.click(screen.getByTestId('nav-goals'))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-completed'))
    expect(screen.getByTestId('completed-g1')).toBeInTheDocument()
  })

  it('un-toggling a milestone lowers progress again', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g1'))
    await user.click(screen.getByTestId('toggle-ms-g1-m1'))
    // 1/4 done now => 25
    expect(screen.getByTestId('detail-progress')).toHaveTextContent('25')
  })
})

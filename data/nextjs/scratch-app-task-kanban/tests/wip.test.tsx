import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('wip counts and limits', () => {
  it('shows per-column counts from seed data', () => {
    render(<App />)
    expect(screen.getByTestId('count-backlog')).toHaveTextContent('1')
    expect(screen.getByTestId('count-doing')).toHaveTextContent('2')
    expect(screen.getByTestId('count-done')).toHaveTextContent('1')
  })

  it('shows no warnings under the default limit of 3', () => {
    render(<App />)
    expect(screen.queryByTestId('warning-backlog')).not.toBeInTheDocument()
    expect(screen.queryByTestId('warning-doing')).not.toBeInTheDocument()
    expect(screen.queryByTestId('warning-done')).not.toBeInTheDocument()
  })

  it('updates counts when a card moves between columns', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('forward-c1')) // backlog->doing
    expect(screen.getByTestId('count-backlog')).toHaveTextContent('0')
    expect(screen.getByTestId('count-doing')).toHaveTextContent('3')
  })

  it('warns a column over the WIP limit', async () => {
    const user = userEvent.setup()
    render(<App />)
    // lower the limit to 1
    await user.click(screen.getByTestId('nav-settings'))
    await user.clear(screen.getByTestId('wip-input'))
    await user.type(screen.getByTestId('wip-input'), '1')
    await user.click(screen.getByTestId('wip-save'))
    await user.click(screen.getByTestId('nav-board'))
    // doing has 2 > 1 => warning; backlog/done have 1 == 1 => no warning
    expect(screen.getByTestId('warning-doing')).toBeInTheDocument()
    expect(screen.queryByTestId('warning-backlog')).not.toBeInTheDocument()
    expect(screen.queryByTestId('warning-done')).not.toBeInTheDocument()
  })

  it('clears the warning when a card is moved out of an over-limit column', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    await user.clear(screen.getByTestId('wip-input'))
    await user.type(screen.getByTestId('wip-input'), '1')
    await user.click(screen.getByTestId('wip-save'))
    await user.click(screen.getByTestId('nav-board'))
    expect(screen.getByTestId('warning-doing')).toBeInTheDocument()
    await user.click(screen.getByTestId('forward-c2')) // doing(2) -> done; doing now 1
    expect(screen.queryByTestId('warning-doing')).not.toBeInTheDocument()
  })

  it('archived cards are excluded from the column count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('archive-c2')) // remove a doing card
    expect(screen.getByTestId('count-doing')).toHaveTextContent('1')
    expect(screen.queryByTestId('card-c2')).not.toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('environments summary', () => {
  it('shows enabled flag counts per environment from seed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-environments'))
    // dev: f1 + f2 enabled => 2; stage: f1 => 1; prod: none => 0
    expect(screen.getByTestId('env-dev-enabled')).toHaveTextContent('2')
    expect(screen.getByTestId('env-stage-enabled')).toHaveTextContent('1')
    expect(screen.getByTestId('env-prod-enabled')).toHaveTextContent('0')
  })

  it('updates the env summary after a toggle', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-f3'))
    await user.click(screen.getByTestId('toggle-prod'))
    await user.click(screen.getByTestId('nav-environments'))
    expect(screen.getByTestId('env-prod-enabled')).toHaveTextContent('1')
  })
})

describe('audit log', () => {
  it('starts empty', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-audit'))
    expect(screen.getByTestId('audit-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('audit-list')).not.toBeInTheDocument()
  })

  it('records a toggle action with the flag key', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-f1'))
    await user.click(screen.getByTestId('toggle-prod'))
    await user.click(screen.getByTestId('nav-audit'))
    expect(screen.getByTestId('audit-list')).toBeInTheDocument()
    expect(screen.getByTestId('audit-a1-action')).toHaveTextContent('toggle')
    expect(screen.getByTestId('audit-a1-flag')).toHaveTextContent('new-checkout')
  })

  it('records a rollout action and lists newest entries first', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-f2'))
    await user.click(screen.getByTestId('toggle-prod')) // a1 toggle
    await user.type(screen.getByTestId('rollout-input'), '80')
    await user.click(screen.getByTestId('set-rollout')) // a2 rollout
    await user.click(screen.getByTestId('nav-audit'))
    const items = screen.getAllByTestId(/^audit-a\d+$/)
    // newest first => a2 (rollout) before a1 (toggle)
    expect(items[0]).toHaveAttribute('data-testid', 'audit-a2')
    expect(screen.getByTestId('audit-a2-action')).toHaveTextContent('rollout')
    expect(items[1]).toHaveAttribute('data-testid', 'audit-a1')
  })
})

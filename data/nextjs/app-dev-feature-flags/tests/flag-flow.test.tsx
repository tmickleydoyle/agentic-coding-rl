import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('flag flow', () => {
  it('lists seeded flags with key, rollout and enabled-env count', () => {
    render(<App />)
    const list = screen.getByTestId('flag-list')
    expect(within(list).getByTestId('flag-f1-key')).toHaveTextContent('new-checkout')
    expect(screen.getByTestId('flag-f1-rollout')).toHaveTextContent('50')
    // f1 enabled in dev + stage => 2
    expect(screen.getByTestId('enabled-f1-count')).toHaveTextContent('2')
    // f3 enabled nowhere => 0
    expect(screen.getByTestId('enabled-f3-count')).toHaveTextContent('0')
  })

  it('opens the detail page and shows per-env toggle state', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-f1'))
    expect(screen.getByTestId('page-flag-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-key')).toHaveTextContent('new-checkout')
    expect(screen.getByTestId('env-row-dev')).toHaveAttribute('data-enabled', 'true')
    expect(screen.getByTestId('env-row-stage')).toHaveAttribute('data-enabled', 'true')
    expect(screen.getByTestId('env-row-prod')).toHaveAttribute('data-enabled', 'false')
  })

  it('toggles an env on the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-f1'))
    expect(screen.getByTestId('env-row-prod')).toHaveAttribute('data-enabled', 'false')
    await user.click(screen.getByTestId('toggle-prod'))
    expect(screen.getByTestId('env-row-prod')).toHaveAttribute('data-enabled', 'true')
    await user.click(screen.getByTestId('toggle-prod'))
    expect(screen.getByTestId('env-row-prod')).toHaveAttribute('data-enabled', 'false')
  })

  it('sets the rollout percentage and clamps it to 100', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-f2'))
    expect(screen.getByTestId('detail-rollout')).toHaveTextContent('25')
    await user.type(screen.getByTestId('rollout-input'), '150')
    await user.click(screen.getByTestId('set-rollout'))
    expect(screen.getByTestId('detail-rollout')).toHaveTextContent('100')
  })

  it('reflects an env toggle in the flag list enabled count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-f3'))
    await user.click(screen.getByTestId('toggle-dev'))
    await user.click(screen.getByTestId('nav-flags'))
    expect(screen.getByTestId('enabled-f3-count')).toHaveTextContent('1')
  })
})

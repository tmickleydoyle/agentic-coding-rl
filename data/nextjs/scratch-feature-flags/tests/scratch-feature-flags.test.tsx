import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Feature Flags', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders heading', () => {
    expect(screen.getByRole('heading', { name: /feature flags/i })).toBeInTheDocument()
  })

  it('shows 4 seed flags', () => {
    expect(screen.getAllByTestId('flag-item')).toHaveLength(4)
  })

  it('shows correct enabled count', () => {
    expect(screen.getByTestId('count-enabled').textContent).toContain('2')
  })

  it('shows correct disabled count', () => {
    expect(screen.getByTestId('count-disabled').textContent).toContain('2')
  })

  it('adds a new flag', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/flag name/i), 'new-feature')
    await user.type(screen.getByLabelText(/description/i), 'A new feature')
    await user.click(screen.getByRole('button', { name: /add flag/i }))
    expect(screen.getAllByTestId('flag-item')).toHaveLength(5)
    const names = screen.getAllByTestId('flag-name').map(el => el.textContent)
    expect(names).toContain('new-feature')
  })

  it('new flag starts disabled', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/flag name/i), 'test-flag')
    await user.click(screen.getByRole('button', { name: /add flag/i }))
    const items = screen.getAllByTestId('flag-item')
    const last = items[items.length - 1]
    expect(within(last).getByTestId('flag-status').textContent).toBe('Disabled')
  })

  it('does not add flag with empty name', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add flag/i }))
    expect(screen.getAllByTestId('flag-item')).toHaveLength(4)
  })

  it('clears form after add', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/flag name/i), 'temp-flag')
    await user.click(screen.getByRole('button', { name: /add flag/i }))
    expect(screen.getByLabelText(/flag name/i)).toHaveValue('')
  })

  it('toggles a flag from disabled to enabled', async () => {
    const user = userEvent.setup()
    const items = screen.getAllByTestId('flag-item')
    const secondItem = items[1]
    expect(within(secondItem).getByTestId('flag-status').textContent).toBe('Disabled')
    await user.click(within(secondItem).getByRole('button', { name: /toggle/i }))
    expect(within(secondItem).getByTestId('flag-status').textContent).toBe('Enabled')
  })

  it('deletes a flag', async () => {
    const user = userEvent.setup()
    const items = screen.getAllByTestId('flag-item')
    await user.click(within(items[0]).getByRole('button', { name: /delete/i }))
    expect(screen.getAllByTestId('flag-item')).toHaveLength(3)
  })

  it('filters by environment', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by environment/i), 'staging')
    expect(screen.getAllByTestId('flag-item')).toHaveLength(2)
    const envs = screen.getAllByTestId('flag-env').map(el => el.textContent)
    envs.forEach(env => expect(env).toBe('staging'))
  })

  it('global counts unchanged when filter active', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by environment/i), 'production')
    expect(screen.getByTestId('count-enabled').textContent).toContain('2')
    expect(screen.getByTestId('count-disabled').textContent).toContain('2')
  })

  it('count updates after toggle', async () => {
    const user = userEvent.setup()
    const items = screen.getAllByTestId('flag-item')
    await user.click(within(items[1]).getByRole('button', { name: /toggle/i }))
    expect(screen.getByTestId('count-enabled').textContent).toContain('3')
    expect(screen.getByTestId('count-disabled').textContent).toContain('1')
  })
})

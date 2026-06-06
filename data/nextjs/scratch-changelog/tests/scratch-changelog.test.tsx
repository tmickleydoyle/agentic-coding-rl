import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Changelog', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders heading', () => {
    expect(screen.getByRole('heading', { name: /changelog/i })).toBeInTheDocument()
  })

  it('shows 4 seed entries', () => {
    expect(screen.getAllByTestId('entry-item')).toHaveLength(4)
  })

  it('shows correct major count', () => {
    expect(screen.getByTestId('count-major').textContent).toContain('1')
  })

  it('shows correct minor count', () => {
    expect(screen.getByTestId('count-minor').textContent).toContain('2')
  })

  it('shows correct patch count', () => {
    expect(screen.getByTestId('count-patch').textContent).toContain('1')
  })

  it('adds a new entry', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/version/i), '2.0.0')
    await user.type(screen.getByLabelText(/summary/i), 'Big release')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getAllByTestId('entry-item')).toHaveLength(5)
    const versions = screen.getAllByTestId('entry-version').map(el => el.textContent)
    expect(versions).toContain('2.0.0')
  })

  it('does not add entry with empty version', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getAllByTestId('entry-item')).toHaveLength(4)
  })

  it('new entry appears first (newest-first ordering)', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/version/i), '9.9.9')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    const items = screen.getAllByTestId('entry-item')
    expect(within(items[0]).getByTestId('entry-version').textContent).toBe('9.9.9')
  })

  it('clears form after add', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/version/i), '3.0.0')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getByLabelText(/version/i)).toHaveValue('')
  })

  it('deletes an entry', async () => {
    const user = userEvent.setup()
    const items = screen.getAllByTestId('entry-item')
    await user.click(within(items[0]).getByRole('button', { name: /delete/i }))
    expect(screen.getAllByTestId('entry-item')).toHaveLength(3)
  })

  it('filters by type', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by type/i), 'patch')
    expect(screen.getAllByTestId('entry-item')).toHaveLength(1)
    expect(screen.getByTestId('entry-type').textContent).toBe('patch')
  })

  it('global counts unchanged when filter active', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by type/i), 'major')
    expect(screen.getByTestId('count-minor').textContent).toContain('2')
    expect(screen.getByTestId('count-patch').textContent).toContain('1')
  })

  it('count updates after adding major entry', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/version/i), '2.0.0')
    await user.selectOptions(screen.getByLabelText(/type/i), 'major')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getByTestId('count-major').textContent).toContain('2')
  })
})

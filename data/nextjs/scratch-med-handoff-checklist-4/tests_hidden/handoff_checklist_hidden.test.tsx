import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Dev Handoff Checklist (held-out)', () => {
  it('completion rounds correctly for 2 of 3 done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write unit tests'))
    await u.click(screen.getByLabelText('Done: Update README'))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
  })

  it('adding an item after reset brings count to 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset checklist/i }))
    await nav(u, 'Checklist')
    await u.type(screen.getByLabelText(/new item/i), 'Post-reset task')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('marking all items done then undoing one updates Summary correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write unit tests'))
    await u.click(screen.getByLabelText('Done: Update README'))
    await u.click(screen.getByLabelText('Done: Tag release'))
    await u.click(screen.getByLabelText('Done: Tag release'))
    await nav(u, 'Summary')
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
  })

  it('Hide done does not change Remaining count displayed on Checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write unit tests'))
    await u.click(screen.getByLabelText('Done: Tag release'))
    await u.click(screen.getByLabelText(/hide done/i))
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('multiple resets leave the list empty each time', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset checklist/i }))
    await nav(u, 'Checklist')
    await u.type(screen.getByLabelText(/new item/i), 'Temp item')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset checklist/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('newly added item can be toggled done and appears in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new item/i), 'Review PR')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    await u.click(screen.getByLabelText('Done: Review PR'))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 4')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 25%')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string) {
  await u.clear(screen.getByLabelText(/new item/i))
  await u.type(screen.getByLabelText(/new item/i), title)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Dev Handoff Checklist app', () => {
  it('starts on the Checklist view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
  })

  it('seeds three initial items', () => {
    render(<App />)
    expect(screen.getByText('Write API documentation')).toBeInTheDocument()
    expect(screen.getByText('Update environment variables')).toBeInTheDocument()
    expect(screen.getByText('Tag release version')).toBeInTheDocument()
  })

  it('shows Completion: 0% and Remaining: 3 on initial load', () => {
    render(<App />)
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Checklist from Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
  })

  it('adds a new item to the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Notify stakeholders')
    expect(screen.getByText('Notify stakeholders')).toBeInTheDocument()
  })

  it('ignores a blank item title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('toggling an item marks it done and updates Completion and Remaining', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write API documentation'))
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('toggling the same item twice returns to original state', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write API documentation'))
    await u.click(screen.getByLabelText('Done: Write API documentation'))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('removes an item from the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Tag release version' }))
    expect(screen.queryByText('Tag release version')).not.toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })

  it('completing all items shows Completion: 100% and Remaining: 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write API documentation'))
    await u.click(screen.getByLabelText('Done: Update environment variables'))
    await u.click(screen.getByLabelText('Done: Tag release version'))
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('Summary shows correct derived stats matching Checklist state (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write API documentation'))
    await u.click(screen.getByLabelText('Done: Tag release version'))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
  })

  it('Summary shows 0% and Remaining: 3 on initial load', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Clear all in Settings removes all items (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: 'Clear all' }))
    await nav(u, 'Checklist')
    expect(screen.queryByText('Write API documentation')).not.toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('Clear all is reflected in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: 'Clear all' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('toggles the theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Checklist')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('checklist state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Done: Write API documentation'))
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })

  it('adding an item after Clear all works correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: 'Clear all' }))
    await nav(u, 'Checklist')
    await addItem(u, 'Deploy to production')
    expect(screen.getByText('Deploy to production')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })
})

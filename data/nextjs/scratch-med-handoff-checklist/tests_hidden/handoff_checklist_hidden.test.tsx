// HELD-OUT generalization tests — fresh scenarios not seen during development.
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

describe('Handoff Checklist (held-out)', () => {
  it('Completion shows 33% when one of three seeded items is done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Mark Tag the release as done'))
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('Remaining decrements correctly as items are checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Mark Write release notes as done'))
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    await u.click(screen.getByLabelText('Mark Update API docs as done'))
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    await u.click(screen.getByLabelText('Mark Tag the release as done'))
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('removing a done item updates the Summary stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Mark Update API docs as done'))
    await u.click(screen.getByRole('button', { name: 'Remove Update API docs' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('adding multiple items and completing some shows correct Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await nav(u, 'Checklist')
    await addItem(u, 'Alpha')
    await addItem(u, 'Beta')
    await addItem(u, 'Gamma')
    await addItem(u, 'Delta')
    await u.click(screen.getByLabelText('Mark Alpha as done'))
    await u.click(screen.getByLabelText('Mark Beta as done'))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 4')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })

  it('Clear all then add new item shows Remaining: 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await nav(u, 'Checklist')
    await addItem(u, 'Post-launch check')
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('theme persists across Checklist and Summary navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Checklist')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('unchecking an item in Checklist is reflected in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Mark Write release notes as done'))
    await u.click(screen.getByLabelText('Mark Write release notes as done'))
    await nav(u, 'Summary')
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('whitespace-only input is ignored as a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/new item/i), '   ')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
  })

  it('new item checkbox starts unchecked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Verify staging')
    expect(screen.getByLabelText('Mark Verify staging as done')).not.toBeChecked()
  })
})

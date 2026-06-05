// HELD-OUT generalization tests — fresh scenarios and sequences not in the visible suite.
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
  it('all three seed items start unchecked', () => {
    render(<App />)
    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach((cb) => {
      expect(cb).not.toBeChecked()
    })
  })

  it('Summary shows Completion: 67% when 2 of 3 are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Write README'))
    await u.click(screen.getByLabelText('Record demo video'))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
  })

  it('adding a new item updates Summary Total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'QA sign-off')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
  })

  it('clearing all done items results in 0% completion in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Write README'))
    await u.click(screen.getByLabelText('Update staging env'))
    await u.click(screen.getByRole('button', { name: /clear done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('turning off Show only remaining restores hidden done items on Checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Record demo video'))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show only remaining/i)) // enable filter
    await nav(u, 'Checklist')
    expect(screen.queryByText('Record demo video')).not.toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show only remaining/i)) // disable filter
    await nav(u, 'Checklist')
    expect(screen.getByText('Record demo video')).toBeInTheDocument()
  })

  it('theme toggle second click goes back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Remaining on Checklist is 0 when all seeded items are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Write README'))
    await u.click(screen.getByLabelText('Record demo video'))
    await u.click(screen.getByLabelText('Update staging env'))
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('newly added item appears after seed items in Checklist list order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Last item')
    const items = screen.getAllByRole('listitem')
    const titles = items.map((li) => li.textContent)
    const lastIdx = titles.findIndex((t) => t && t.includes('Last item'))
    const envIdx = titles.findIndex((t) => t && t.includes('Update staging env'))
    expect(lastIdx).toBeGreaterThan(envIdx)
  })

  it('Summary has no heading other than Summary on that view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    const headings = screen.getAllByRole('heading')
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent('Summary')
  })

  it('Clear done on Checklist updates Summary Done count to 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Write README'))
    await u.click(screen.getByLabelText('Update staging env'))
    await u.click(screen.getByRole('button', { name: /clear done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
  })
})

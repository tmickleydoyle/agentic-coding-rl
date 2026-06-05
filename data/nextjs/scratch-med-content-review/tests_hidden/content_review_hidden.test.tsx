import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Content Review Tracker (held-out)', () => {
  it('all three seeded reviewers are displayed', () => {
    render(<App />)
    const allAlice = screen.getAllByText('Alice')
    expect(allAlice.length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('adding two items raises count to 5', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (const [t, r] of [['Feature spec', 'Gina'], ['Release notes', 'Harry']]) {
      await u.clear(screen.getByLabelText('Item title'))
      await u.type(screen.getByLabelText('Item title'), t)
      await u.clear(screen.getByLabelText('Reviewer'))
      await u.type(screen.getByLabelText('Reviewer'), r)
      await u.click(screen.getByRole('button', { name: 'Add item' }))
    }
    expect(screen.getByRole('heading', { name: 'Items (5)' })).toBeInTheDocument()
  })

  it('approving the two draft/changes seeds gives 100% approval rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    const pricingLi = screen.getByText('Pricing page').closest('li') as HTMLElement
    await u.click(within(pricingLi).getByRole('button', { name: 'Approve' }))
    const aboutLi = screen.getByText('About us').closest('li') as HTMLElement
    await u.click(within(aboutLi).getByRole('button', { name: 'Approve' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Approval rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Approved: 3')).toBeInTheDocument()
  })

  it('filter persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
  })

  it('stats Draft count increases when an item is reset to draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Homepage copy').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Reset to draft' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
    expect(screen.getByText('Approved: 0')).toBeInTheDocument()
    expect(screen.getByText('Approval rate: 0%')).toBeInTheDocument()
  })

  it('changes filter shows About us but not others', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'changes')
    expect(screen.getByText('About us')).toBeInTheDocument()
    expect(screen.queryByText('Homepage copy')).not.toBeInTheDocument()
    expect(screen.queryByText('Pricing page')).not.toBeInTheDocument()
  })

  it('stats Changes requested updates after clicking Request changes', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Pricing page').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Request changes' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Changes requested: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
  })

  it('new item added while filter is active does not appear in filtered list if status mismatches', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'approved')
    await u.type(screen.getByLabelText('Item title'), 'Draft piece')
    await u.type(screen.getByLabelText('Reviewer'), 'Ivy')
    await u.click(screen.getByRole('button', { name: 'Add item' }))
    // still shows only the one approved item
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
    expect(screen.queryByText('Draft piece')).not.toBeInTheDocument()
  })

  it('theme toggles back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('total items in stats reflects all items regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'approved')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Portfolio Projects (held-out)', () => {
  it('seed data categories appear correctly in the list', () => {
    render(<App />)
    const li = screen.getByText('Brand Redesign').closest('li') as HTMLElement
    expect(within(li).getByText('Design')).toBeInTheDocument()
    const li2 = screen.getByText('API Integration').closest('li') as HTMLElement
    expect(within(li2).getByText('Development')).toBeInTheDocument()
  })

  it('toggles theme back to light after two clicks', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Live only filter count reflects newly added live project after toggle', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Project title'), 'Extra Project')
    await u.type(screen.getByLabelText('Category'), 'Design')
    await u.click(screen.getByRole('button', { name: 'Add project' }))
    // toggle the new draft to live
    const li = screen.getByText('Extra Project').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Toggle status' }))
    await u.click(screen.getByRole('button', { name: 'Live only' }))
    expect(screen.getByText('Showing: 3 projects')).toBeInTheDocument()
  })

  it('adding a Design project updates Stats Design count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Project title'), 'Icon Set')
    await u.type(screen.getByLabelText('Category'), 'Design')
    await u.click(screen.getByRole('button', { name: 'Add project' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Design: 3')).toBeInTheDocument()
  })

  it('Stats Draft count increases after toggling a live project to draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Landing Page').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Toggle status' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
  })

  it('Live rate rounds correctly for 1 of 3 live', async () => {
    const u = userEvent.setup()
    render(<App />)
    // make only one live: toggle Brand Redesign and Landing Page to draft
    const li1 = screen.getByText('Brand Redesign').closest('li') as HTMLElement
    await u.click(within(li1).getByRole('button', { name: 'Toggle status' }))
    const li2 = screen.getByText('Landing Page').closest('li') as HTMLElement
    await u.click(within(li2).getByRole('button', { name: 'Toggle status' }))
    // now toggle API Integration to live
    const li3 = screen.getByText('API Integration').closest('li') as HTMLElement
    await u.click(within(li3).getByRole('button', { name: 'Toggle status' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 33%')).toBeInTheDocument()
  })

  it('Showing count updates immediately after adding a project under All filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Project title'), 'Fourth Project')
    await u.type(screen.getByLabelText('Category'), 'Development')
    await u.click(screen.getByRole('button', { name: 'Add project' }))
    expect(screen.getByText('Showing: 4 projects')).toBeInTheDocument()
  })

  it('filter state persists when navigating to Stats and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Live only' }))
    await nav(u, 'Stats')
    await nav(u, 'Projects')
    expect(screen.getByText('Showing: 2 projects')).toBeInTheDocument()
    expect(screen.queryByText('API Integration')).not.toBeInTheDocument()
  })

  it('Stats Total projects is 0 if all removed by toggling then no items — seed is intact so just verify total 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 3')).toBeInTheDocument()
  })

  it('newly added project with custom category does not affect Design or Development counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Project title'), 'Podcast Site')
    await u.type(screen.getByLabelText('Category'), 'Marketing')
    await u.click(screen.getByRole('button', { name: 'Add project' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Design: 2')).toBeInTheDocument()
    expect(screen.getByText('Development: 1')).toBeInTheDocument()
    expect(screen.getByText('Total projects: 4')).toBeInTheDocument()
  })
})

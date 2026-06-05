import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addStakeholder(u: U, name: string, influence?: string) {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  if (influence) {
    await u.selectOptions(screen.getByLabelText('Influence'), influence)
  }
  await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
}

describe('Stakeholder Map (held-out)', () => {
  it('adds multiple stakeholders and heading count updates each time', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Abe', 'High')
    expect(screen.getByRole('heading', { name: 'Stakeholders (1)' })).toBeInTheDocument()
    await addStakeholder(u, 'Bea', 'Med')
    expect(screen.getByRole('heading', { name: 'Stakeholders (2)' })).toBeInTheDocument()
    await addStakeholder(u, 'Cal', 'Low')
    expect(screen.getByRole('heading', { name: 'Stakeholders (3)' })).toBeInTheDocument()
  })

  it('removes one of several stakeholders and count decrements', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Dan', 'High')
    await addStakeholder(u, 'Eli', 'Med')
    await u.click(screen.getByRole('button', { name: 'Remove Dan' }))
    expect(screen.queryByText('Dan')).not.toBeInTheDocument()
    expect(screen.getByText('Eli')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Stakeholders (1)' })).toBeInTheDocument()
  })

  it('filter by Med influence hides High and Low rows', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Fay', 'High')
    await addStakeholder(u, 'Gil', 'Med')
    await addStakeholder(u, 'Hal', 'Low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'Med')
    expect(screen.queryByText('Fay')).not.toBeInTheDocument()
    expect(screen.getByText('Gil')).toBeInTheDocument()
    expect(screen.queryByText('Hal')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Stakeholders (1)' })).toBeInTheDocument()
  })

  it('Summary High/Med/Low counts are correct after mixed adds', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ida', 'High')
    await addStakeholder(u, 'Jay', 'High')
    await addStakeholder(u, 'Kay', 'Med')
    await nav(u, 'Summary')
    expect(screen.getByText('High: 2')).toBeInTheDocument()
    expect(screen.getByText('Med: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 0')).toBeInTheDocument()
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })

  it('support rate rounds correctly for one-third', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Leo', 'High')
    await addStakeholder(u, 'Moe', 'Med')
    await addStakeholder(u, 'Nia', 'Low')
    const li1 = screen.getByText('Leo').closest('li') as HTMLElement
    await u.click(within(li1).getByRole('button', { name: 'Supportive' }))
    const li2 = screen.getByText('Moe').closest('li') as HTMLElement
    await u.click(within(li2).getByRole('button', { name: 'Supportive' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 1')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 33%')).toBeInTheDocument()
  })

  it('removing a stakeholder updates Summary totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ona', 'High')
    await addStakeholder(u, 'Pip', 'Med')
    await nav(u, 'Stakeholders')
    await u.click(screen.getByRole('button', { name: 'Remove Ona' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('High: 0')).toBeInTheDocument()
    expect(screen.getByText('Med: 1')).toBeInTheDocument()
  })

  it('support rate is 0% after all stakeholders removed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Rex', 'High')
    await u.click(screen.getByRole('button', { name: 'Remove Rex' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
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

  it('filter state resets to All after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Sue', 'High')
    await addStakeholder(u, 'Tom', 'Low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'High')
    await nav(u, 'Summary')
    await nav(u, 'Stakeholders')
    // Both should be visible again (local filter state resets on unmount)
    expect(screen.getByText('Sue')).toBeInTheDocument()
    expect(screen.getByText('Tom')).toBeInTheDocument()
  })

  it('whitespace-only name is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Name'), '   ')
    await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
    expect(screen.getByRole('heading', { name: 'Stakeholders (0)' })).toBeInTheDocument()
  })
})

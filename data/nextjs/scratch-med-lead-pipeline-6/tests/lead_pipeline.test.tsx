import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addLead(u: U, company: string, stage: string, value: string) {
  await u.clear(screen.getByLabelText('Company'))
  await u.type(screen.getByLabelText('Company'), company)
  await u.selectOptions(screen.getByLabelText('Stage'), stage)
  await u.clear(screen.getByLabelText('Deal Value'))
  await u.type(screen.getByLabelText('Deal Value'), value)
  await u.click(screen.getByRole('button', { name: /add lead/i }))
}

describe('Lead Pipeline app', () => {
  it('starts on the Leads view with seed data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Leads' })).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('shows correct heading count for all seeded leads', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'All Leads (3)' })).toBeInTheDocument()
  })

  it('displays seed lead values formatted with dollar sign', () => {
    render(<App />)
    expect(screen.getByText('$12000')).toBeInTheDocument()
    expect(screen.getByText('$8500')).toBeInTheDocument()
    expect(screen.getByText('$3200')).toBeInTheDocument()
  })

  it('navigates to Pipeline view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByRole('heading', { name: 'Pipeline' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Leads view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    await nav(u, 'Leads')
    expect(screen.getByRole('heading', { name: 'Leads' })).toBeInTheDocument()
  })

  it('adds a new lead and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Umbrella Co', 'demo', '20000')
    expect(screen.getByText('Umbrella Co')).toBeInTheDocument()
    expect(screen.getByText('$20000')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'All Leads (4)' })).toBeInTheDocument()
  })

  it('ignores a lead with a blank company name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '1000')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByRole('heading', { name: 'All Leads (3)' })).toBeInTheDocument()
  })

  it('ignores a lead with zero deal value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Company'), 'Ghost Inc')
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '0')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByRole('heading', { name: 'All Leads (3)' })).toBeInTheDocument()
  })

  it('deletes a lead and updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Globex' }))
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'All Leads (2)' })).toBeInTheDocument()
  })

  it('filters leads by New stage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'New' }))
    expect(screen.getByRole('heading', { name: 'New Leads (1)' })).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.queryByText('Initech')).not.toBeInTheDocument()
  })

  it('filters leads by Demo stage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Demo' }))
    expect(screen.getByRole('heading', { name: 'Demo Leads (1)' })).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('filters leads by Won stage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Won' }))
    expect(screen.getByRole('heading', { name: 'Won Leads (1)' })).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('returns to All after filtering', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'New' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByRole('heading', { name: 'All Leads (3)' })).toBeInTheDocument()
  })

  it('shows correct Pipeline stats for seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total Leads: 3')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Demo: 1')).toBeInTheDocument()
    expect(screen.getByText('Won: 1')).toBeInTheDocument()
    expect(screen.getByText('Total Pipeline: $23700')).toBeInTheDocument()
    expect(screen.getByText('Won Pipeline: $3200')).toBeInTheDocument()
  })

  it('computes win rate correctly for seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByText('Win Rate: 33%')).toBeInTheDocument()
  })

  it('shows win rate 0% when no leads exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Acme Corp' }))
    await u.click(screen.getByRole('button', { name: 'Delete Globex' }))
    await u.click(screen.getByRole('button', { name: 'Delete Initech' }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Win Rate: 0%')).toBeInTheDocument()
    expect(screen.getByText('Total Pipeline: $0')).toBeInTheDocument()
  })

  it('Pipeline updates after adding a lead (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Massive Dynamic', 'won', '50000')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total Leads: 4')).toBeInTheDocument()
    expect(screen.getByText('Won: 2')).toBeInTheDocument()
    expect(screen.getByText('Total Pipeline: $73700')).toBeInTheDocument()
    expect(screen.getByText('Won Pipeline: $53200')).toBeInTheDocument()
    expect(screen.getByText('Win Rate: 50%')).toBeInTheDocument()
  })

  it('Pipeline updates after deleting a lead (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Initech' }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total Leads: 2')).toBeInTheDocument()
    expect(screen.getByText('Won: 0')).toBeInTheDocument()
    expect(screen.getByText('Won Pipeline: $0')).toBeInTheDocument()
    expect(screen.getByText('Win Rate: 0%')).toBeInTheDocument()
  })

  it('toggles theme between light and dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Leads')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Pipeline')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('filter does not affect Pipeline totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'New' }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total Leads: 3')).toBeInTheDocument()
  })

  it('lead list state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Persistco', 'new', '9999')
    await nav(u, 'Pipeline')
    await nav(u, 'Leads')
    expect(screen.getByText('Persistco')).toBeInTheDocument()
    expect(screen.getByText('$9999')).toBeInTheDocument()
  })
})

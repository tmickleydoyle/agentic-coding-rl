import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addLead(u: U, company: string, value: string, stage: string) {
  await u.clear(screen.getByLabelText('Company'))
  await u.type(screen.getByLabelText('Company'), company)
  await u.clear(screen.getByLabelText('Deal Value'))
  await u.type(screen.getByLabelText('Deal Value'), value)
  await u.selectOptions(screen.getByLabelText('Stage'), stage)
  await u.click(screen.getByRole('button', { name: /add lead/i }))
}

describe('Lead Pipeline app', () => {
  it('starts on the Leads view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /leads \(3\)/i })).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByRole('heading', { name: 'Pipeline' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Leads')
    expect(screen.getByRole('heading', { name: /leads/i })).toBeInTheDocument()
  })

  it('displays seeded deal values formatted as dollars', () => {
    render(<App />)
    expect(screen.getByText('$5000')).toBeInTheDocument()
    expect(screen.getByText('$12000')).toBeInTheDocument()
    expect(screen.getByText('$8000')).toBeInTheDocument()
  })

  it('adds a new lead and increments the heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Umbrella Co', '3000', 'new')
    expect(screen.getByRole('heading', { name: /leads \(4\)/i })).toBeInTheDocument()
    expect(screen.getByText('Umbrella Co')).toBeInTheDocument()
    expect(screen.getByText('$3000')).toBeInTheDocument()
  })

  it('ignores a lead with blank company name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '1000')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByRole('heading', { name: /leads \(3\)/i })).toBeInTheDocument()
  })

  it('ignores a lead with zero deal value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Company'), 'Ghost Inc')
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '0')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByRole('heading', { name: /leads \(3\)/i })).toBeInTheDocument()
  })

  it('deletes a lead and updates the heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme corp/i }))
    expect(screen.getByRole('heading', { name: /leads \(2\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('filters by stage new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    expect(screen.getByRole('heading', { name: /leads \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.queryByText('Initech')).not.toBeInTheDocument()
  })

  it('filters by stage demo', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    expect(screen.getByRole('heading', { name: /leads \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('filters by stage won', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    expect(screen.getByRole('heading', { name: /leads \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('resets filter to all restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'all')
    expect(screen.getByRole('heading', { name: /leads \(3\)/i })).toBeInTheDocument()
  })

  it('pipeline shows correct seeded totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 3')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Demo: 1')).toBeInTheDocument()
    expect(screen.getByText('Won: 1')).toBeInTheDocument()
    expect(screen.getByText('Total value: $25000')).toBeInTheDocument()
    expect(screen.getByText('Won value: $8000')).toBeInTheDocument()
  })

  it('pipeline updates after adding a new lead', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Vandelay', '7000', 'won')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 4')).toBeInTheDocument()
    expect(screen.getByText('Won: 2')).toBeInTheDocument()
    expect(screen.getByText('Total value: $32000')).toBeInTheDocument()
    expect(screen.getByText('Won value: $15000')).toBeInTheDocument()
  })

  it('pipeline updates after deleting a lead', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete initech/i }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 2')).toBeInTheDocument()
    expect(screen.getByText('Won: 0')).toBeInTheDocument()
    expect(screen.getByText('Total value: $17000')).toBeInTheDocument()
    expect(screen.getByText('Won value: $0')).toBeInTheDocument()
  })

  it('pipeline counts are not affected by the filter on the Leads view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 3')).toBeInTheDocument()
    expect(screen.getByText('Total value: $25000')).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    await nav(u, 'Pipeline')
    await nav(u, 'Leads')
    expect(screen.getByRole('heading', { name: /leads \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
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

  it('settings shows current theme label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('leads state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Persistent Co', '9999', 'demo')
    await nav(u, 'Pipeline')
    await nav(u, 'Leads')
    expect(screen.getByText('Persistent Co')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /leads \(4\)/i })).toBeInTheDocument()
  })
})

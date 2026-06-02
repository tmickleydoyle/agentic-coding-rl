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
    expect(screen.getByRole('heading', { name: /leads \(3\)/i })).toBeInTheDocument()
  })

  it('shows all three seed companies on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('displays seed lead values formatted with dollar sign', () => {
    render(<App />)
    expect(screen.getByText('$5000')).toBeInTheDocument()
    expect(screen.getByText('$12000')).toBeInTheDocument()
    expect(screen.getByText('$8500')).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: /leads/i })).toBeInTheDocument()
  })

  it('adds a new lead and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Umbrella Corp', 'demo', '20000')
    expect(screen.getByText('Umbrella Corp')).toBeInTheDocument()
    expect(screen.getByText('$20000')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /leads \(4\)/i })).toBeInTheDocument()
  })

  it('ignores a lead with blank company', async () => {
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
    await u.type(screen.getByLabelText('Company'), 'Ghost Co')
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '0')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByRole('heading', { name: /leads \(3\)/i })).toBeInTheDocument()
  })

  it('deletes a lead and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete globex/i }))
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /leads \(2\)/i })).toBeInTheDocument()
  })

  it('filters leads by stage "new"', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    expect(screen.getByRole('heading', { name: /leads \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.queryByText('Initech')).not.toBeInTheDocument()
  })

  it('filters leads by stage "won"', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    expect(screen.getByRole('heading', { name: /leads \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('restores all leads when filter set back to "all"', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'all')
    expect(screen.getByRole('heading', { name: /leads \(3\)/i })).toBeInTheDocument()
  })

  it('Pipeline shows correct total leads', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 3')).toBeInTheDocument()
  })

  it('Pipeline shows correct stage counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Demo: 1')).toBeInTheDocument()
    expect(screen.getByText('Won: 1')).toBeInTheDocument()
  })

  it('Pipeline shows correct total pipeline value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total pipeline: $25500')).toBeInTheDocument()
  })

  it('Pipeline shows correct won pipeline value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByText('Won pipeline: $8500')).toBeInTheDocument()
  })

  it('Pipeline updates when a new lead is added (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Massive Dynamics', 'won', '10000')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 4')).toBeInTheDocument()
    expect(screen.getByText('Won: 2')).toBeInTheDocument()
    expect(screen.getByText('Total pipeline: $35500')).toBeInTheDocument()
    expect(screen.getByText('Won pipeline: $18500')).toBeInTheDocument()
  })

  it('Pipeline updates after deleting a lead (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete initech/i }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 2')).toBeInTheDocument()
    expect(screen.getByText('Won: 0')).toBeInTheDocument()
    expect(screen.getByText('Won pipeline: $0')).toBeInTheDocument()
  })

  it('toggles theme from light to dark via Settings', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating back to Leads', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Leads')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    await nav(u, 'Pipeline')
    await nav(u, 'Leads')
    expect(screen.getByRole('heading', { name: /leads \(1\)/i })).toBeInTheDocument()
  })
})

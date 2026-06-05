import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addLead(u: U, company: string, stage: string, dealValue: string) {
  await u.clear(screen.getByLabelText('Company'))
  await u.type(screen.getByLabelText('Company'), company)
  await u.selectOptions(screen.getByLabelText('Stage'), stage)
  await u.clear(screen.getByLabelText('Deal Value'))
  await u.type(screen.getByLabelText('Deal Value'), dealValue)
  await u.click(screen.getByRole('button', { name: /add lead/i }))
}

describe('Lead Pipeline app', () => {
  it('starts on the Leads view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Leads' })).toBeInTheDocument()
  })

  it('renders three seeded leads on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Beta LLC')).toBeInTheDocument()
    expect(screen.getByText('Gamma Inc')).toBeInTheDocument()
  })

  it('shows seeded leads with correct deal values', () => {
    render(<App />)
    expect(screen.getByText('$5000')).toBeInTheDocument()
    expect(screen.getByText('$12000')).toBeInTheDocument()
    expect(screen.getByText('$8000')).toBeInTheDocument()
  })

  it('shows Showing: 3 leads with seeded data and no filter', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 leads')).toBeInTheDocument()
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

  it('navigates back to Leads view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Leads')
    expect(screen.getByRole('heading', { name: 'Leads' })).toBeInTheDocument()
  })

  it('adds a new lead and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Delta Co', 'demo', '9000')
    expect(screen.getByText('Delta Co')).toBeInTheDocument()
    expect(screen.getByText('$9000')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 leads')).toBeInTheDocument()
  })

  it('ignores a lead with blank company name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '1000')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByText('Showing: 3 leads')).toBeInTheDocument()
  })

  it('ignores a lead with zero deal value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Company'), 'Ghost Co')
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '0')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByText('Showing: 3 leads')).toBeInTheDocument()
  })

  it('deletes a lead and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Acme Corp' }))
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 leads')).toBeInTheDocument()
  })

  it('filters by stage new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Beta LLC')).not.toBeInTheDocument()
    expect(screen.queryByText('Gamma Inc')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 leads')).toBeInTheDocument()
  })

  it('filters by stage demo', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.getByText('Beta LLC')).toBeInTheDocument()
    expect(screen.queryByText('Gamma Inc')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 leads')).toBeInTheDocument()
  })

  it('filters by stage won', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.queryByText('Beta LLC')).not.toBeInTheDocument()
    expect(screen.getByText('Gamma Inc')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 leads')).toBeInTheDocument()
  })

  it('resets to all leads when filter changes back to all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'all')
    expect(screen.getByText('Showing: 3 leads')).toBeInTheDocument()
  })

  it('Summary shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total leads: 3')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Demo: 1')).toBeInTheDocument()
    expect(screen.getByText('Won: 1')).toBeInTheDocument()
    expect(screen.getByText('Total pipeline: $25000')).toBeInTheDocument()
    expect(screen.getByText('Won value: $8000')).toBeInTheDocument()
  })

  it('Summary updates after adding a lead (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Echo Ltd', 'won', '7000')
    await nav(u, 'Summary')
    expect(screen.getByText('Total leads: 4')).toBeInTheDocument()
    expect(screen.getByText('Won: 2')).toBeInTheDocument()
    expect(screen.getByText('Total pipeline: $32000')).toBeInTheDocument()
    expect(screen.getByText('Won value: $15000')).toBeInTheDocument()
  })

  it('Summary updates after deleting a lead (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Beta LLC' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total leads: 2')).toBeInTheDocument()
    expect(screen.getByText('Demo: 0')).toBeInTheDocument()
    expect(screen.getByText('Total pipeline: $13000')).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    await nav(u, 'Summary')
    await nav(u, 'Leads')
    expect(screen.getByText('Showing: 1 leads')).toBeInTheDocument()
  })

  it('Summary totals ignore the active filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    await nav(u, 'Summary')
    expect(screen.getByText('Total leads: 3')).toBeInTheDocument()
    expect(screen.getByText('Total pipeline: $25000')).toBeInTheDocument()
  })

  it('toggles theme to dark in Settings', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view switches', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Leads')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })
})

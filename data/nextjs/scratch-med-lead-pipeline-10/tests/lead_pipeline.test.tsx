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

  it('shows seeded leads on startup', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('shows seeded lead deal values formatted correctly', () => {
    render(<App />)
    expect(screen.getByText('$1000.00')).toBeInTheDocument()
    expect(screen.getByText('$2500.00')).toBeInTheDocument()
    expect(screen.getByText('$800.00')).toBeInTheDocument()
  })

  it('shows correct initial showing count', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 leads')).toBeInTheDocument()
  })

  it('adds a new lead and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Umbrella Corp', 'demo', '5000')
    expect(screen.getByText('Umbrella Corp')).toBeInTheDocument()
    expect(screen.getByText('$5000.00')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 leads')).toBeInTheDocument()
  })

  it('ignores a lead with blank company', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Company'))
    await u.type(screen.getByLabelText('Deal Value'), '100')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByText('Showing: 3 leads')).toBeInTheDocument()
  })

  it('ignores a lead with zero deal value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Company'), 'Ghost Inc')
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '0')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByText('Showing: 3 leads')).toBeInTheDocument()
  })

  it('deletes a lead', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete globex/i }))
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 leads')).toBeInTheDocument()
  })

  it('filters leads by stage: new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    expect(screen.getByText('Showing: 1 leads')).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.queryByText('Initech')).not.toBeInTheDocument()
  })

  it('filters leads by stage: demo', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    expect(screen.getByText('Showing: 1 leads')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('filters leads by stage: won', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    expect(screen.getByText('Showing: 1 leads')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('restores all leads when filter is set back to all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'all')
    expect(screen.getByText('Showing: 3 leads')).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    await nav(u, 'Pipeline')
    await nav(u, 'Leads')
    expect(screen.getByText('Showing: 1 leads')).toBeInTheDocument()
  })

  it('pipeline shows correct total leads count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 3')).toBeInTheDocument()
  })

  it('pipeline shows correct stage counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Demo: 1')).toBeInTheDocument()
    expect(screen.getByText('Won: 1')).toBeInTheDocument()
  })

  it('pipeline shows correct total value of seeded leads', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total value: $4300.00')).toBeInTheDocument()
  })

  it('pipeline shows correct won value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByText('Won value: $800.00')).toBeInTheDocument()
  })

  it('pipeline updates after adding a new lead (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Weyland Corp', 'won', '3000')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 4')).toBeInTheDocument()
    expect(screen.getByText('Total value: $7300.00')).toBeInTheDocument()
    expect(screen.getByText('Won value: $3800.00')).toBeInTheDocument()
    expect(screen.getByText('Won: 2')).toBeInTheDocument()
  })

  it('pipeline updates after deleting a lead (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme corp/i }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 2')).toBeInTheDocument()
    expect(screen.getByText('Total value: $3300.00')).toBeInTheDocument()
    expect(screen.getByText('New: 0')).toBeInTheDocument()
  })

  it('pipeline totals are unaffected by the Leads filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 3')).toBeInTheDocument()
    expect(screen.getByText('Total value: $4300.00')).toBeInTheDocument()
  })

  it('toggles the theme and persists it across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Pipeline')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Leads')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })
})

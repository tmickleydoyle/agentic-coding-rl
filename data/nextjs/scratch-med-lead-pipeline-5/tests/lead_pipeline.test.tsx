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
  it('starts on the Leads view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /leads/i })).toBeInTheDocument()
  })

  it('seeds three leads on startup', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('shows seeded lead values formatted correctly', () => {
    render(<App />)
    expect(screen.getByText('$5000.00')).toBeInTheDocument()
    expect(screen.getByText('$12000.00')).toBeInTheDocument()
    expect(screen.getByText('$8500.00')).toBeInTheDocument()
  })

  it('heading shows count of visible leads', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Leads (3)' })).toBeInTheDocument()
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

  it('adds a new lead and it appears in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Umbrella Corp', '20000', 'demo')
    expect(screen.getByText('Umbrella Corp')).toBeInTheDocument()
    expect(screen.getByText('$20000.00')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Leads (4)' })).toBeInTheDocument()
  })

  it('ignores a lead with a blank company name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '1000')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByRole('heading', { name: 'Leads (3)' })).toBeInTheDocument()
  })

  it('ignores a lead with a zero deal value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Company'))
    await u.type(screen.getByLabelText('Company'), 'Ghost Corp')
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '0')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByRole('heading', { name: 'Leads (3)' })).toBeInTheDocument()
  })

  it('deletes a lead', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Acme Corp' }))
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Leads (2)' })).toBeInTheDocument()
  })

  it('filters by stage new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    expect(screen.getByRole('heading', { name: 'Leads (1)' })).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.queryByText('Initech')).not.toBeInTheDocument()
  })

  it('filters by stage demo', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    expect(screen.getByRole('heading', { name: 'Leads (1)' })).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('filters by stage won', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    expect(screen.getByRole('heading', { name: 'Leads (1)' })).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('filter all restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'all')
    expect(screen.getByRole('heading', { name: 'Leads (3)' })).toBeInTheDocument()
  })

  it('pipeline shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 3')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Demo: 1')).toBeInTheDocument()
    expect(screen.getByText('Won: 1')).toBeInTheDocument()
    expect(screen.getByText('Total pipeline: $25500.00')).toBeInTheDocument()
    expect(screen.getByText('Won value: $8500.00')).toBeInTheDocument()
  })

  it('pipeline win rate rounds correctly for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByText('Win rate: 33%')).toBeInTheDocument()
  })

  it('pipeline shows 0% win rate when there are no leads', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Acme Corp' }))
    await u.click(screen.getByRole('button', { name: 'Delete Globex' }))
    await u.click(screen.getByRole('button', { name: 'Delete Initech' }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
    expect(screen.getByText('Total pipeline: $0.00')).toBeInTheDocument()
  })

  it('adding a lead updates the pipeline stats (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Stark Industries', '50000', 'won')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 4')).toBeInTheDocument()
    expect(screen.getByText('Won: 2')).toBeInTheDocument()
    expect(screen.getByText('Total pipeline: $75500.00')).toBeInTheDocument()
    expect(screen.getByText('Won value: $58500.00')).toBeInTheDocument()
  })

  it('deleting a lead updates pipeline stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Initech' }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 2')).toBeInTheDocument()
    expect(screen.getByText('Won: 0')).toBeInTheDocument()
    expect(screen.getByText('Total pipeline: $17000.00')).toBeInTheDocument()
    expect(screen.getByText('Won value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
  })

  it('pipeline is unaffected by Leads stage filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 3')).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    await nav(u, 'Pipeline')
    await nav(u, 'Leads')
    expect(screen.getByRole('heading', { name: 'Leads (1)' })).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Pipeline')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Leads')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })
})

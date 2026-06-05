import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addProject(u: U, title: string, category: string) {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.clear(screen.getByLabelText('Category'))
  await u.type(screen.getByLabelText('Category'), category)
  await u.click(screen.getByRole('button', { name: /add project/i }))
}

function row(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Portfolio Projects (held-out)', () => {
  it('seed data shows two live and one draft project', () => {
    render(<App />)
    expect(within(row('Personal Website')).getByText('live')).toBeInTheDocument()
    expect(within(row('API Boilerplate')).getByText('live')).toBeInTheDocument()
    expect(within(row('Budget App')).getByText('draft')).toBeInTheDocument()
  })

  it('filter live count updates after marking a draft project live', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Budget App')).getByRole('button', { name: /mark live budget app/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'live')
    expect(screen.getByText('Showing: 3 projects')).toBeInTheDocument()
  })

  it('filter draft count drops to zero after all projects are made live', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Budget App')).getByRole('button', { name: /mark live budget app/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    expect(screen.getByText('Showing: 0 projects')).toBeInTheDocument()
  })

  it('toggling live-to-draft then back reflects correctly in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Personal Website')).getByRole('button', { name: /mark draft personal website/i }))
    expect(within(row('Personal Website')).getByText('draft')).toBeInTheDocument()
    await u.click(within(row('Personal Website')).getByRole('button', { name: /mark live personal website/i }))
    expect(within(row('Personal Website')).getByText('live')).toBeInTheDocument()
  })

  it('deleting a live project reduces Live count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Personal Website')).getByRole('button', { name: /delete personal website/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
    expect(screen.getByText('Total projects: 2')).toBeInTheDocument()
  })

  it('Stats live rate is 50% when half are live', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Personal Website')).getByRole('button', { name: /delete personal website/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 50%')).toBeInTheDocument()
  })

  it('adding projects to the same category increments that category count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'E-commerce Site', 'Web')
    await addProject(u, 'Portfolio v2', 'Web')
    await nav(u, 'Stats')
    expect(screen.getByText('Web: 3')).toBeInTheDocument()
  })

  it('a brand-new category appears in Stats breakdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'ML Classifier', 'AI')
    await nav(u, 'Stats')
    expect(screen.getByText('AI: 1')).toBeInTheDocument()
  })

  it('Stats Draft count updates when a project is toggled to draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('API Boilerplate')).getByRole('button', { name: /mark draft api boilerplate/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
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

  it('filter persists the selected value across interactions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'live')
    await addProject(u, 'Hidden Draft', 'Web')
    expect(screen.queryByText('Hidden Draft')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 projects')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addProject(
  u: U,
  title: string,
  category = 'Web',
  status = 'Live',
) {
  await u.clear(screen.getByLabelText(/project title/i))
  await u.type(screen.getByLabelText(/project title/i), title)
  await u.selectOptions(screen.getByLabelText(/^category$/i), category)
  await u.selectOptions(screen.getByLabelText(/^status$/i), status)
  await u.click(screen.getByRole('button', { name: /add project/i }))
}

describe('Portfolio Projects app', () => {
  it('starts on the Projects view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /projects \(0\)/i })).toBeInTheDocument()
  })

  it('shows Live: 0 initially', () => {
    render(<App />)
    expect(screen.getByText('Live: 0')).toBeInTheDocument()
  })

  it('navigates to Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Projects view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Projects')
    expect(screen.getByRole('heading', { name: /projects \(0\)/i })).toBeInTheDocument()
  })

  it('adds a project and updates the heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'My Website', 'Web', 'Live')
    expect(screen.getByRole('heading', { name: /projects \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('My Website')).toBeInTheDocument()
  })

  it('ignores a blank project title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add project/i }))
    expect(screen.getByRole('heading', { name: /projects \(0\)/i })).toBeInTheDocument()
  })

  it('shows the correct status badge on a new project', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Draft App', 'Mobile', 'Draft')
    const li = screen.getByText('Draft App').closest('li') as HTMLElement
    expect(within(li).getByText('Draft')).toBeInTheDocument()
  })

  it('updates Live count after adding a live project', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Live Site', 'Web', 'Live')
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
  })

  it('toggling status flips Live to Draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Flip Me', 'Design', 'Live')
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle status Flip Me/i }))
    const li = screen.getByText('Flip Me').closest('li') as HTMLElement
    expect(within(li).getByText('Draft')).toBeInTheDocument()
    expect(screen.getByText('Live: 0')).toBeInTheDocument()
  })

  it('toggling status flips Draft back to Live', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Toggler', 'Web', 'Draft')
    await u.click(screen.getByRole('button', { name: /toggle status Toggler/i }))
    const li = screen.getByText('Toggler').closest('li') as HTMLElement
    expect(within(li).getByText('Live')).toBeInTheDocument()
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
  })

  it('deletes a project', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Doomed', 'Mobile', 'Live')
    expect(screen.getByText('Doomed')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete Doomed/i }))
    expect(screen.queryByText('Doomed')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /projects \(0\)/i })).toBeInTheDocument()
  })

  it('filters projects by category', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Web One', 'Web', 'Live')
    await addProject(u, 'Mobile One', 'Mobile', 'Draft')
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'Web')
    expect(screen.getByRole('heading', { name: /projects \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Web One')).toBeInTheDocument()
    expect(screen.queryByText('Mobile One')).not.toBeInTheDocument()
  })

  it('Live count is not affected by the filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Web Live', 'Web', 'Live')
    await addProject(u, 'Mobile Live', 'Mobile', 'Live')
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'Web')
    // Only 1 project visible but Live: 2 because filter doesn't affect live count
    expect(screen.getByText('Live: 2')).toBeInTheDocument()
  })

  it('resetting filter to All shows all projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Alpha', 'Web', 'Live')
    await addProject(u, 'Beta', 'Design', 'Draft')
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'Design')
    expect(screen.getByRole('heading', { name: /projects \(1\)/i })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'All')
    expect(screen.getByRole('heading', { name: /projects \(2\)/i })).toBeInTheDocument()
  })

  it('Stats shows correct totals (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'P1', 'Web', 'Live')
    await addProject(u, 'P2', 'Mobile', 'Draft')
    await addProject(u, 'P3', 'Design', 'Live')
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 3')).toBeInTheDocument()
    expect(screen.getByText('Live: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
  })

  it('Stats shows correct category counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'W1', 'Web', 'Live')
    await addProject(u, 'W2', 'Web', 'Draft')
    await addProject(u, 'M1', 'Mobile', 'Live')
    await nav(u, 'Stats')
    expect(screen.getByText('Web: 2')).toBeInTheDocument()
    expect(screen.getByText('Mobile: 1')).toBeInTheDocument()
    expect(screen.getByText('Design: 0')).toBeInTheDocument()
  })

  it('Stats shows Live rate: 0% with no projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 0%')).toBeInTheDocument()
  })

  it('Stats computes live rate correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'A', 'Web', 'Live')
    await addProject(u, 'B', 'Web', 'Draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 50%')).toBeInTheDocument()
  })

  it('Stats updates after toggling status (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Switchable', 'Web', 'Live')
    await u.click(screen.getByRole('button', { name: /toggle status Switchable/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live: 0')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 0%')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Settings toggles the theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Projects')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('projects list persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Persistent', 'Design', 'Live')
    await nav(u, 'Stats')
    await nav(u, 'Projects')
    expect(screen.getByText('Persistent')).toBeInTheDocument()
  })
})

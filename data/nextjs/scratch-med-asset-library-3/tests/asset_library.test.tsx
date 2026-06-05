import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addAsset(u: U, name: string, type: string, tags = '') {
  await u.clear(screen.getByLabelText(/asset name/i))
  await u.type(screen.getByLabelText(/asset name/i), name)
  await u.selectOptions(screen.getByLabelText(/asset type/i), type)
  await u.clear(screen.getByLabelText(/tags/i))
  if (tags) await u.type(screen.getByLabelText(/tags/i), tags)
  await u.click(screen.getByRole('button', { name: /add asset/i }))
}

describe('Asset Library app', () => {
  it('starts on the Library view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument()
  })

  it('seeds three assets on load', () => {
    render(<App />)
    expect(screen.getByText('Brand Logo')).toBeInTheDocument()
    expect(screen.getByText('Home Icon')).toBeInTheDocument()
    expect(screen.getByText('Hero Photo')).toBeInTheDocument()
  })

  it('shows Assets (3) heading with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /assets \(3\)/i })).toBeInTheDocument()
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

  it('navigates back to Library from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Library')
    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument()
  })

  it('adds a new logo asset and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Startup Logo', 'logo', 'startup')
    expect(screen.getByText('Startup Logo')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /assets \(4\)/i })).toBeInTheDocument()
  })

  it('ignores blank asset name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add asset/i }))
    expect(screen.getByRole('heading', { name: /assets \(3\)/i })).toBeInTheDocument()
  })

  it('deletes an asset by name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete hero photo/i }))
    expect(screen.queryByText('Hero Photo')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /assets \(2\)/i })).toBeInTheDocument()
  })

  it('filters by logo type', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'logo')
    expect(screen.getByRole('heading', { name: /assets \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Brand Logo')).toBeInTheDocument()
    expect(screen.queryByText('Home Icon')).not.toBeInTheDocument()
    expect(screen.queryByText('Hero Photo')).not.toBeInTheDocument()
  })

  it('filters by icon type', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'icon')
    expect(screen.getByRole('heading', { name: /assets \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Home Icon')).toBeInTheDocument()
  })

  it('filters by photo type', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'photo')
    expect(screen.getByRole('heading', { name: /assets \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Hero Photo')).toBeInTheDocument()
  })

  it('restores all assets when filter set back to All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'logo')
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'All')
    expect(screen.getByRole('heading', { name: /assets \(3\)/i })).toBeInTheDocument()
  })

  it('Stats shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 3')).toBeInTheDocument()
    expect(screen.getByText('Logos: 1')).toBeInTheDocument()
    expect(screen.getByText('Icons: 1')).toBeInTheDocument()
    expect(screen.getByText('Photos: 1')).toBeInTheDocument()
  })

  it('Stats shows tagged count (seeded: 2 have tags)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Tagged: 2')).toBeInTheDocument()
  })

  it('Stats updates after adding an asset (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'New Icon', 'icon', 'ui')
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 4')).toBeInTheDocument()
    expect(screen.getByText('Icons: 2')).toBeInTheDocument()
    expect(screen.getByText('Tagged: 3')).toBeInTheDocument()
  })

  it('Stats updates after deleting an asset (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete brand logo/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 2')).toBeInTheDocument()
    expect(screen.getByText('Logos: 0')).toBeInTheDocument()
    expect(screen.getByText('Tagged: 1')).toBeInTheDocument()
  })

  it('Stats ignores library filter — counts all assets', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'logo')
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 3')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark and back', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Library')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('library state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Persisted Asset', 'photo')
    await nav(u, 'Stats')
    await nav(u, 'Library')
    expect(screen.getByText('Persisted Asset')).toBeInTheDocument()
  })

  it('asset tags are shown in the list', () => {
    render(<App />)
    expect(screen.getByText('brand,primary')).toBeInTheDocument()
    expect(screen.getByText('ui,nav')).toBeInTheDocument()
  })
})

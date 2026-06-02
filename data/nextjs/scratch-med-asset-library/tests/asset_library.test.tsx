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
  await u.clear(screen.getByLabelText(/^tags$/i))
  if (tags) await u.type(screen.getByLabelText(/^tags$/i), tags)
  await u.click(screen.getByRole('button', { name: /add asset/i }))
}

describe('Asset Library app', () => {
  it('starts on the Library view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument()
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

  it('navigates back to Library view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Library')
    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument()
  })

  it('shows seeded assets on startup', () => {
    render(<App />)
    expect(screen.getByText('Acme Logo (logo)')).toBeInTheDocument()
    expect(screen.getByText('Home Icon (icon)')).toBeInTheDocument()
    expect(screen.getByText('Hero Photo (photo)')).toBeInTheDocument()
  })

  it('shows Showing: 3 of 3 on startup', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 of 3')).toBeInTheDocument()
  })

  it('adds a new asset and it appears in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Brand Mark', 'logo', 'brand')
    expect(screen.getByText('Brand Mark (logo)')).toBeInTheDocument()
  })

  it('ignores a blank asset name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add asset/i }))
    expect(screen.getByText('Showing: 3 of 3')).toBeInTheDocument()
  })

  it('updates Showing count after adding an asset', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'New Icon', 'icon')
    expect(screen.getByText('Showing: 4 of 4')).toBeInTheDocument()
  })

  it('deletes an asset', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme logo/i }))
    expect(screen.queryByText('Acme Logo (logo)')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 of 2')).toBeInTheDocument()
  })

  it('filters by logo type', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'logo')
    expect(screen.getByText('Showing: 1 of 3')).toBeInTheDocument()
    expect(screen.getByText('Acme Logo (logo)')).toBeInTheDocument()
    expect(screen.queryByText('Home Icon (icon)')).not.toBeInTheDocument()
    expect(screen.queryByText('Hero Photo (photo)')).not.toBeInTheDocument()
  })

  it('filters by icon type', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'icon')
    expect(screen.getByText('Showing: 1 of 3')).toBeInTheDocument()
    expect(screen.getByText('Home Icon (icon)')).toBeInTheDocument()
  })

  it('filters by photo type', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'photo')
    expect(screen.getByText('Showing: 1 of 3')).toBeInTheDocument()
    expect(screen.getByText('Hero Photo (photo)')).toBeInTheDocument()
  })

  it('resetting filter to All shows all assets', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'icon')
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'All')
    expect(screen.getByText('Showing: 3 of 3')).toBeInTheDocument()
  })

  it('Stats shows correct seeded counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 3')).toBeInTheDocument()
    expect(screen.getByText('Logos: 1')).toBeInTheDocument()
    expect(screen.getByText('Icons: 1')).toBeInTheDocument()
    expect(screen.getByText('Photos: 1')).toBeInTheDocument()
  })

  it('Stats updates after adding an asset (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Splash Photo', 'photo', 'hero')
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 4')).toBeInTheDocument()
    expect(screen.getByText('Photos: 2')).toBeInTheDocument()
  })

  it('Stats updates after deleting an asset (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete home icon/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 2')).toBeInTheDocument()
    expect(screen.getByText('Icons: 0')).toBeInTheDocument()
  })

  it('Stats uses full unfiltered count even when filter is active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'logo')
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 3')).toBeInTheDocument()
    expect(screen.getByText('Icons: 1')).toBeInTheDocument()
  })

  it('toggles theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Library')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('library state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Persisted Asset', 'icon', 'test')
    await nav(u, 'Stats')
    await nav(u, 'Library')
    expect(screen.getByText('Persisted Asset (icon)')).toBeInTheDocument()
  })

  it('filter state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'photo')
    await nav(u, 'Stats')
    await nav(u, 'Library')
    expect(screen.getByText('Showing: 1 of 3')).toBeInTheDocument()
  })

  it('filtered count updates when an asset matching filter is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'logo')
    await addAsset(u, 'Secondary Logo', 'logo', 'alt')
    expect(screen.getByText('Showing: 2 of 4')).toBeInTheDocument()
  })
})

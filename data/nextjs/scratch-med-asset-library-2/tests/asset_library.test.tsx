import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addAsset(u: U, name: string, type: string, tags: string) {
  await u.clear(screen.getByLabelText(/asset name/i))
  await u.type(screen.getByLabelText(/asset name/i), name)
  await u.selectOptions(screen.getByLabelText(/asset type/i), type)
  await u.clear(screen.getByLabelText(/tags/i))
  await u.type(screen.getByLabelText(/tags/i), tags)
  await u.click(screen.getByRole('button', { name: /add asset/i }))
}

describe('Asset Library app', () => {
  it('starts on the Library view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument()
  })

  it('shows seeded assets on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Logo (logo)')).toBeInTheDocument()
    expect(screen.getByText('Home Icon (icon)')).toBeInTheDocument()
    expect(screen.getByText('Hero Photo (photo)')).toBeInTheDocument()
  })

  it('shows initial Showing count of 3', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 assets')).toBeInTheDocument()
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

  it('adds a new logo asset', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'New Logo', 'logo', 'rebrand')
    expect(screen.getByText('New Logo (logo)')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 assets')).toBeInTheDocument()
  })

  it('ignores adding an asset with a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add asset/i }))
    expect(screen.getByText('Showing: 3 assets')).toBeInTheDocument()
  })

  it('shows tags for seeded assets', () => {
    render(<App />)
    expect(screen.getByText('brand, primary')).toBeInTheDocument()
    expect(screen.getByText('nav, ui')).toBeInTheDocument()
    expect(screen.getByText('landing, hero')).toBeInTheDocument()
  })

  it('deletes an asset', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete home icon/i }))
    expect(screen.queryByText('Home Icon (icon)')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 assets')).toBeInTheDocument()
  })

  it('filters by logo type', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'logo' }))
    expect(screen.getByText('Acme Logo (logo)')).toBeInTheDocument()
    expect(screen.queryByText('Home Icon (icon)')).not.toBeInTheDocument()
    expect(screen.queryByText('Hero Photo (photo)')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 assets')).toBeInTheDocument()
  })

  it('filters by icon type', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'icon' }))
    expect(screen.getByText('Home Icon (icon)')).toBeInTheDocument()
    expect(screen.queryByText('Acme Logo (logo)')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 assets')).toBeInTheDocument()
  })

  it('filters by photo type', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'photo' }))
    expect(screen.getByText('Hero Photo (photo)')).toBeInTheDocument()
    expect(screen.queryByText('Acme Logo (logo)')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 assets')).toBeInTheDocument()
  })

  it('All filter restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'logo' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 3 assets')).toBeInTheDocument()
  })

  it('active filter button has aria-pressed true', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'icon' }))
    expect(screen.getByRole('button', { name: 'icon' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('Stats shows seeded totals', async () => {
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
    await addAsset(u, 'Extra Icon', 'icon', 'toolbar')
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 4')).toBeInTheDocument()
    expect(screen.getByText('Icons: 2')).toBeInTheDocument()
  })

  it('Stats updates after deleting an asset (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete hero photo/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 2')).toBeInTheDocument()
    expect(screen.getByText('Photos: 0')).toBeInTheDocument()
  })

  it('toggles theme to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Library')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('preserves library state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Saved Asset', 'photo', 'test')
    await nav(u, 'Stats')
    await nav(u, 'Library')
    expect(screen.getByText('Saved Asset (photo)')).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'logo' }))
    await nav(u, 'Stats')
    await nav(u, 'Library')
    expect(screen.getByRole('button', { name: 'logo' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Showing: 1 assets')).toBeInTheDocument()
  })
})

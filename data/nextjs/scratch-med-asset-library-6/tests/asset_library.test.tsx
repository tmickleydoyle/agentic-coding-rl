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
  await u.clear(screen.getByLabelText(/^tags$/i))
  await u.type(screen.getByLabelText(/^tags$/i), tags)
  await u.click(screen.getByRole('button', { name: /add asset/i }))
}

describe('Asset Library app', () => {
  it('starts on the Library view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument()
  })

  it('seeds three initial assets', () => {
    render(<App />)
    expect(screen.getByText('Acme Logo')).toBeInTheDocument()
    expect(screen.getByText('Home Icon')).toBeInTheDocument()
    expect(screen.getByText('Hero Photo')).toBeInTheDocument()
  })

  it('shows Showing: 3 assets initially', () => {
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

  it('navigates back to Library view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Library')
    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument()
  })

  it('adds a new asset and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Banner Ad', 'photo', 'ads, promo')
    expect(screen.getByText('Banner Ad')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 assets')).toBeInTheDocument()
  })

  it('ignores a blank asset name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add asset/i }))
    expect(screen.getByText('Showing: 3 assets')).toBeInTheDocument()
  })

  it('deletes an asset', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Home Icon' }))
    expect(screen.queryByText('Home Icon')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 assets')).toBeInTheDocument()
  })

  it('filters by type logo', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'logo')
    expect(screen.getByText('Showing: 1 assets')).toBeInTheDocument()
    expect(screen.getByText('Acme Logo')).toBeInTheDocument()
    expect(screen.queryByText('Home Icon')).not.toBeInTheDocument()
    expect(screen.queryByText('Hero Photo')).not.toBeInTheDocument()
  })

  it('filters by type icon', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'icon')
    expect(screen.getByText('Showing: 1 assets')).toBeInTheDocument()
    expect(screen.getByText('Home Icon')).toBeInTheDocument()
  })

  it('filters by type photo', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'photo')
    expect(screen.getByText('Showing: 1 assets')).toBeInTheDocument()
    expect(screen.getByText('Hero Photo')).toBeInTheDocument()
  })

  it('filter All restores full count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'logo')
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'All')
    expect(screen.getByText('Showing: 3 assets')).toBeInTheDocument()
  })

  it('Stats shows correct initial totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 3')).toBeInTheDocument()
    expect(screen.getByText('Logos: 1')).toBeInTheDocument()
    expect(screen.getByText('Icons: 1')).toBeInTheDocument()
    expect(screen.getByText('Photos: 1')).toBeInTheDocument()
  })

  it('Stats top type is logo when tied (logo wins tie)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Top type: logo')).toBeInTheDocument()
  })

  it('Stats updates after adding an asset (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'New Icon', 'icon', 'ui')
    await addAsset(u, 'Another Icon', 'icon', 'ui')
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 5')).toBeInTheDocument()
    expect(screen.getByText('Icons: 3')).toBeInTheDocument()
    expect(screen.getByText('Top type: icon')).toBeInTheDocument()
  })

  it('Stats shows Top type: none when no assets', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all assets/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 0')).toBeInTheDocument()
    expect(screen.getByText('Top type: none')).toBeInTheDocument()
  })

  it('Clear all assets removes everything from Library', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all assets/i }))
    await nav(u, 'Library')
    expect(screen.getByText('Showing: 0 assets')).toBeInTheDocument()
    expect(screen.queryByText('Acme Logo')).not.toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Library')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('library state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Sticky Asset', 'logo', 'test')
    await nav(u, 'Stats')
    await nav(u, 'Library')
    expect(screen.getByText('Sticky Asset')).toBeInTheDocument()
  })

  it('filter state resets are independent of asset state', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'icon')
    expect(screen.getByText('Showing: 1 assets')).toBeInTheDocument()
    await nav(u, 'Stats')
    await nav(u, 'Library')
    // filter may or may not persist — just confirm assets are still present
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'All')
    expect(screen.getByText('Showing: 3 assets')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addAsset(u: U, name: string, type: string, tags: string) {
  await u.clear(screen.getByLabelText(/asset name/i))
  await u.type(screen.getByLabelText(/asset name/i), name)
  await u.selectOptions(screen.getByLabelText(/^type$/i), type)
  await u.clear(screen.getByLabelText(/^tags$/i))
  if (tags) await u.type(screen.getByLabelText(/^tags$/i), tags)
  await u.click(screen.getByRole('button', { name: /add asset/i }))
}

describe('Asset Library app', () => {
  it('starts on the Library view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument()
  })

  it('shows seeded assets on startup', () => {
    render(<App />)
    expect(screen.getByText('Company Logo')).toBeInTheDocument()
    expect(screen.getByText('Menu Icon')).toBeInTheDocument()
    expect(screen.getByText('Hero Photo')).toBeInTheDocument()
  })

  it('shows Showing: 3 assets on startup', () => {
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

  it('navigates back to Library', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Library')
    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument()
  })

  it('shows seeded stats on Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 3')).toBeInTheDocument()
    expect(screen.getByText('Logos: 1')).toBeInTheDocument()
    expect(screen.getByText('Icons: 1')).toBeInTheDocument()
    expect(screen.getByText('Photos: 1')).toBeInTheDocument()
  })

  it('adds a new asset and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Sidebar Icon', 'icon', 'ui, nav')
    expect(screen.getByText('Sidebar Icon')).toBeInTheDocument()
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
    await u.click(screen.getByRole('button', { name: /delete menu icon/i }))
    expect(screen.queryByText('Menu Icon')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 assets')).toBeInTheDocument()
  })

  it('filters by type logo', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'logo')
    expect(screen.getByText('Showing: 1 assets')).toBeInTheDocument()
    expect(screen.getByText('Company Logo')).toBeInTheDocument()
    expect(screen.queryByText('Menu Icon')).not.toBeInTheDocument()
    expect(screen.queryByText('Hero Photo')).not.toBeInTheDocument()
  })

  it('filters by type icon', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'icon')
    expect(screen.getByText('Showing: 1 assets')).toBeInTheDocument()
    expect(screen.getByText('Menu Icon')).toBeInTheDocument()
  })

  it('filters by type photo', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'photo')
    expect(screen.getByText('Showing: 1 assets')).toBeInTheDocument()
    expect(screen.getByText('Hero Photo')).toBeInTheDocument()
  })

  it('resetting filter to All shows all assets', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'icon')
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'All')
    expect(screen.getByText('Showing: 3 assets')).toBeInTheDocument()
  })

  it('adding a logo updates Stats Logos count (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Alt Logo', 'logo', 'brand')
    await nav(u, 'Stats')
    expect(screen.getByText('Logos: 2')).toBeInTheDocument()
    expect(screen.getByText('Total assets: 4')).toBeInTheDocument()
  })

  it('deleting an asset updates Stats total (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete hero photo/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 2')).toBeInTheDocument()
    expect(screen.getByText('Photos: 0')).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'icon')
    await nav(u, 'Stats')
    await nav(u, 'Library')
    expect(screen.getByText('Showing: 1 assets')).toBeInTheDocument()
  })

  it('filter does not affect Stats totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'logo')
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 3')).toBeInTheDocument()
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

  it('theme persists when navigating back to Library', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Library')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('shows tags for seeded assets', () => {
    render(<App />)
    expect(screen.getByText('brand, primary')).toBeInTheDocument()
    expect(screen.getByText('nav, ui')).toBeInTheDocument()
    expect(screen.getByText('landing, hero')).toBeInTheDocument()
  })

  it('new asset appears with correct type text', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Background Photo', 'photo', 'bg')
    const li = screen.getByText('Background Photo').closest('li') as HTMLElement
    expect(within(li).getByText('photo')).toBeInTheDocument()
    expect(within(li).getByText('bg')).toBeInTheDocument()
  })

  it('filter count updates when new matching asset is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'icon')
    await u.selectOptions(screen.getByLabelText(/^type$/i), 'icon')
    await u.type(screen.getByLabelText(/asset name/i), 'Close Icon')
    await u.click(screen.getByRole('button', { name: /add asset/i }))
    expect(screen.getByText('Showing: 2 assets')).toBeInTheDocument()
  })
})

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
  if (tags) await u.type(screen.getByLabelText(/tags/i), tags)
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

  it('shows seeded assets on load', () => {
    render(<App />)
    expect(screen.getByText('Wordmark')).toBeInTheDocument()
    expect(screen.getByText('Favicon')).toBeInTheDocument()
    expect(screen.getByText('Hero Shot')).toBeInTheDocument()
  })

  it('shows correct All count with seed data', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'All (3)' })).toBeInTheDocument()
  })

  it('shows correct type counts with seed data', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'logo (1)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'icon (1)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'photo (1)' })).toBeInTheDocument()
  })

  it('adds a new asset and updates the All count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Banner', 'logo', 'campaign')
    expect(screen.getByText('Banner')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All (4)' })).toBeInTheDocument()
  })

  it('ignores a blank asset name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add asset/i }))
    expect(screen.getByRole('button', { name: 'All (3)' })).toBeInTheDocument()
  })

  it('updates type count after adding an icon', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Gear', 'icon', 'ui')
    expect(screen.getByRole('button', { name: 'icon (2)' })).toBeInTheDocument()
  })

  it('filters to show only logos', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /^logo \(/ }))
    expect(screen.getByText('Wordmark')).toBeInTheDocument()
    expect(screen.queryByText('Favicon')).not.toBeInTheDocument()
    expect(screen.queryByText('Hero Shot')).not.toBeInTheDocument()
  })

  it('filter buttons always reflect total counts, not filtered counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /^logo \(/ }))
    expect(screen.getByRole('button', { name: 'All (3)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'icon (1)' })).toBeInTheDocument()
  })

  it('All filter restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /^icon \(/ }))
    await u.click(screen.getByRole('button', { name: /^All \(/ }))
    expect(screen.getByText('Wordmark')).toBeInTheDocument()
    expect(screen.getByText('Favicon')).toBeInTheDocument()
    expect(screen.getByText('Hero Shot')).toBeInTheDocument()
  })

  it('deletes an asset and updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Wordmark' }))
    expect(screen.queryByText('Wordmark')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All (2)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'logo (0)' })).toBeInTheDocument()
  })

  it('Stats view shows correct totals from seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 3')).toBeInTheDocument()
    expect(screen.getByText('Logos: 1')).toBeInTheDocument()
    expect(screen.getByText('Icons: 1')).toBeInTheDocument()
    expect(screen.getByText('Photos: 1')).toBeInTheDocument()
  })

  it('Stats view reflects newly added assets (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Avatar', 'photo', 'profile')
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 4')).toBeInTheDocument()
    expect(screen.getByText('Photos: 2')).toBeInTheDocument()
  })

  it('Stats most common type: None when library is empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Wordmark' }))
    await u.click(screen.getByRole('button', { name: 'Delete Favicon' }))
    await u.click(screen.getByRole('button', { name: 'Delete Hero Shot' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Most common type: None')).toBeInTheDocument()
    expect(screen.getByText('Total assets: 0')).toBeInTheDocument()
  })

  it('Stats most common type is logo when logos dominate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Logo 2', 'logo', '')
    await nav(u, 'Stats')
    expect(screen.getByText('Most common type: logo')).toBeInTheDocument()
  })

  it('Stats most common type breaks ties favoring logo over icon', async () => {
    const u = userEvent.setup()
    render(<App />)
    // seed: 1 logo, 1 icon, 1 photo — add one more logo and one more icon -> 2 logo, 2 icon, 1 photo
    await addAsset(u, 'Logo 2', 'logo', '')
    await addAsset(u, 'Icon 2', 'icon', '')
    await nav(u, 'Stats')
    expect(screen.getByText('Most common type: logo')).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /^photo \(/ }))
    await nav(u, 'Stats')
    await nav(u, 'Library')
    expect(screen.getByText('Hero Shot')).toBeInTheDocument()
    expect(screen.queryByText('Wordmark')).not.toBeInTheDocument()
  })

  it('toggles theme via data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
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

  it('Stats view reflects deletion (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Favicon' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 2')).toBeInTheDocument()
    expect(screen.getByText('Icons: 0')).toBeInTheDocument()
  })
})

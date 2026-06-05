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

describe('Asset Library (held-out)', () => {
  it('adds multiple logos and they all appear in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Primary Logo', 'logo', 'brand')
    await addAsset(u, 'Dark Logo', 'logo', 'brand, dark')
    expect(screen.getByText('Primary Logo')).toBeInTheDocument()
    expect(screen.getByText('Dark Logo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'logo (3)' })).toBeInTheDocument()
  })

  it('filtering by icon hides logos and photos', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Bell', 'icon', 'notification')
    await u.click(screen.getByRole('button', { name: /^icon \(/ }))
    expect(screen.getByText('Favicon')).toBeInTheDocument()
    expect(screen.getByText('Bell')).toBeInTheDocument()
    expect(screen.queryByText('Wordmark')).not.toBeInTheDocument()
    expect(screen.queryByText('Hero Shot')).not.toBeInTheDocument()
  })

  it('deleting while a type filter is active updates the filter button count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /^photo \(/ }))
    await u.click(screen.getByRole('button', { name: 'Delete Hero Shot' }))
    expect(screen.getByRole('button', { name: 'photo (0)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All (2)' })).toBeInTheDocument()
  })

  it('Stats most common type is photo when photos dominate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Portrait', 'photo', 'team')
    await addAsset(u, 'Office', 'photo', 'team')
    await nav(u, 'Stats')
    expect(screen.getByText('Most common type: photo')).toBeInTheDocument()
    expect(screen.getByText('Photos: 3')).toBeInTheDocument()
  })

  it('Stats total is zero after deleting all seeded assets', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Wordmark' }))
    await u.click(screen.getByRole('button', { name: 'Delete Favicon' }))
    await u.click(screen.getByRole('button', { name: 'Delete Hero Shot' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 0')).toBeInTheDocument()
    expect(screen.getByText('Logos: 0')).toBeInTheDocument()
    expect(screen.getByText('Icons: 0')).toBeInTheDocument()
    expect(screen.getByText('Photos: 0')).toBeInTheDocument()
    expect(screen.getByText('Most common type: None')).toBeInTheDocument()
  })

  it('adding an asset then navigating to Stats and back preserves the asset', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Sticker', 'icon', 'fun')
    await nav(u, 'Stats')
    await nav(u, 'Library')
    expect(screen.getByText('Sticker')).toBeInTheDocument()
  })

  it('tags are displayed for a newly added asset', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Cover Photo', 'photo', 'editorial, hero')
    expect(screen.getByText('editorial, hero')).toBeInTheDocument()
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

  it('Stats most common type: icon when icons outnumber others', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Arrow', 'icon', 'nav')
    await addAsset(u, 'Star', 'icon', 'rating')
    await nav(u, 'Stats')
    expect(screen.getByText('Most common type: icon')).toBeInTheDocument()
    expect(screen.getByText('Icons: 3')).toBeInTheDocument()
  })

  it('photo filter shows newly added photo', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Team Photo', 'photo', 'about')
    await u.click(screen.getByRole('button', { name: /^photo \(/ }))
    expect(screen.getByText('Team Photo')).toBeInTheDocument()
    expect(screen.getByText('Hero Shot')).toBeInTheDocument()
    expect(screen.queryByText('Wordmark')).not.toBeInTheDocument()
  })
})

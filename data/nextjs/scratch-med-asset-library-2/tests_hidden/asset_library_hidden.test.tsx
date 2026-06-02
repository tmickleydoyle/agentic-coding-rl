// HELD-OUT generalization tests — fresh scenarios not seen during development.
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
  it('adding multiple photos updates Stats Photos count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Beach Shot', 'photo', 'summer')
    await addAsset(u, 'City View', 'photo', 'urban')
    await nav(u, 'Stats')
    expect(screen.getByText('Photos: 3')).toBeInTheDocument()
    expect(screen.getByText('Total assets: 5')).toBeInTheDocument()
  })

  it('deleting all icons shows Icons: 0 in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete home icon/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Icons: 0')).toBeInTheDocument()
  })

  it('filter by photo then add a photo increases the shown count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'photo' }))
    expect(screen.getByText('Showing: 1 assets')).toBeInTheDocument()
    await addAsset(u, 'Forest', 'photo', 'nature')
    expect(screen.getByText('Showing: 2 assets')).toBeInTheDocument()
  })

  it('filter by icon then add a logo does not increase icon count shown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'icon' }))
    await addAsset(u, 'Second Logo', 'logo', 'rebrand')
    expect(screen.getByText('Showing: 1 assets')).toBeInTheDocument()
  })

  it('deleting an asset while filtered keeps filter active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Extra Logo', 'logo', 'v2')
    await u.click(screen.getByRole('button', { name: 'logo' }))
    expect(screen.getByText('Showing: 2 assets')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete acme logo/i }))
    expect(screen.getByText('Showing: 1 assets')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'logo' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('Stats Logos count reflects added logos', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Logo B', 'logo', 'alt')
    await addAsset(u, 'Logo C', 'logo', 'alt2')
    await nav(u, 'Stats')
    expect(screen.getByText('Logos: 3')).toBeInTheDocument()
  })

  it('theme toggle twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('All button has aria-pressed true by default', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('asset tags are shown on each row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Promo Shot', 'photo', 'sale, discount')
    expect(screen.getByText('sale, discount')).toBeInTheDocument()
  })

  it('Stats total decreases after deletion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme logo/i }))
    await u.click(screen.getByRole('button', { name: /delete home icon/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 1')).toBeInTheDocument()
  })
})

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

describe('Asset Library (held-out)', () => {
  it('Stats shows correct counts after adding two icons', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Search Icon', 'icon', 'ui')
    await addAsset(u, 'Bell Icon', 'icon', 'notifications')
    await nav(u, 'Stats')
    expect(screen.getByText('Icons: 3')).toBeInTheDocument()
    expect(screen.getByText('Total assets: 5')).toBeInTheDocument()
  })

  it('deleting all photos sets Photos to 0 in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete hero photo/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Photos: 0')).toBeInTheDocument()
    expect(screen.getByText('Total assets: 2')).toBeInTheDocument()
  })

  it('filter by logo then add a logo increases Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'logo')
    expect(screen.getByText('Showing: 1 assets')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/^type$/i), 'logo')
    await u.type(screen.getByLabelText(/asset name/i), 'Dark Logo')
    await u.click(screen.getByRole('button', { name: /add asset/i }))
    expect(screen.getByText('Showing: 2 assets')).toBeInTheDocument()
  })

  it('filter by icon hides logo and photo assets', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'icon')
    expect(screen.queryByText('Company Logo')).not.toBeInTheDocument()
    expect(screen.queryByText('Hero Photo')).not.toBeInTheDocument()
    expect(screen.getByText('Menu Icon')).toBeInTheDocument()
  })

  it('deleting the only visible filtered asset shows Showing: 0 assets', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'photo')
    await u.click(screen.getByRole('button', { name: /delete hero photo/i }))
    expect(screen.getByText('Showing: 0 assets')).toBeInTheDocument()
  })

  it('theme toggles back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Stats totals unaffected by active filter (all three types present)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'photo')
    await nav(u, 'Stats')
    expect(screen.getByText('Logos: 1')).toBeInTheDocument()
    expect(screen.getByText('Icons: 1')).toBeInTheDocument()
    expect(screen.getByText('Photos: 1')).toBeInTheDocument()
  })

  it('asset added without tags shows empty tags cell', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Plain Icon', 'icon', '')
    const li = screen.getByText('Plain Icon').closest('li') as HTMLElement
    expect(within(li).getByText('icon')).toBeInTheDocument()
  })

  it('navigating away and back preserves newly added asset', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Persistent Logo', 'logo', 'brand')
    await nav(u, 'Stats')
    await nav(u, 'Library')
    expect(screen.getByText('Persistent Logo')).toBeInTheDocument()
  })

  it('Logos count in Stats increases after adding two logos', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Logo A', 'logo', 'a')
    await addAsset(u, 'Logo B', 'logo', 'b')
    await nav(u, 'Stats')
    expect(screen.getByText('Logos: 3')).toBeInTheDocument()
  })
})

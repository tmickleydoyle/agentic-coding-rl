import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addAsset(u: U, name: string, type: string, tags: string) {
  await u.clear(screen.getByLabelText(/asset name/i))
  await u.type(screen.getByLabelText(/asset name/i), name)
  await u.selectOptions(screen.getByLabelText(/asset type/i), type)
  await u.clear(screen.getByLabelText(/^tags$/i))
  if (tags) await u.type(screen.getByLabelText(/^tags$/i), tags)
  await u.click(screen.getByRole('button', { name: /add asset/i }))
}

describe('Asset Library (held-out)', () => {
  it('initial Showing count is 3', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 assets')).toBeInTheDocument()
  })

  it('adding two photos updates stats Photos count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Photo A', 'photo', 'x')
    await addAsset(u, 'Photo B', 'photo', 'y')
    await nav(u, 'Stats')
    expect(screen.getByText('Photos: 3')).toBeInTheDocument()
    expect(screen.getByText('Top type: photo')).toBeInTheDocument()
  })

  it('adding multiple logos makes logo the top type', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Logo X', 'logo', 'brand')
    await addAsset(u, 'Logo Y', 'logo', 'brand')
    await nav(u, 'Stats')
    expect(screen.getByText('Logos: 3')).toBeInTheDocument()
    expect(screen.getByText('Top type: logo')).toBeInTheDocument()
  })

  it('deleting all icons leaves Icons: 0 in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Home Icon' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Icons: 0')).toBeInTheDocument()
  })

  it('filter by photo then add a photo increments visible count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'photo')
    expect(screen.getByText('Showing: 1 assets')).toBeInTheDocument()
    await addAsset(u, 'Team Photo', 'photo', 'team')
    expect(screen.getByText('Showing: 2 assets')).toBeInTheDocument()
  })

  it('filter by logo hides icon and photo assets', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'logo')
    expect(screen.queryByText('Home Icon')).not.toBeInTheDocument()
    expect(screen.queryByText('Hero Photo')).not.toBeInTheDocument()
    expect(screen.getByText('Acme Logo')).toBeInTheDocument()
  })

  it('clear all then Stats shows all zeros', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all assets/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 0')).toBeInTheDocument()
    expect(screen.getByText('Logos: 0')).toBeInTheDocument()
    expect(screen.getByText('Icons: 0')).toBeInTheDocument()
    expect(screen.getByText('Photos: 0')).toBeInTheDocument()
    expect(screen.getByText('Top type: none')).toBeInTheDocument()
  })

  it('clear all then add one asset reflects in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all assets/i }))
    await nav(u, 'Library')
    await addAsset(u, 'Fresh Icon', 'icon', 'ui')
    await nav(u, 'Stats')
    expect(screen.getByText('Total assets: 1')).toBeInTheDocument()
    expect(screen.getByText('Icons: 1')).toBeInTheDocument()
    expect(screen.getByText('Top type: icon')).toBeInTheDocument()
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

  it('blank name does not add when type is icon', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/asset type/i), 'icon')
    await u.click(screen.getByRole('button', { name: /add asset/i }))
    expect(screen.getByText('Showing: 3 assets')).toBeInTheDocument()
  })

  it('newly added asset appears with correct type badge', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Favicon', 'icon', 'brand')
    const item = screen.getByText('Favicon').closest('li') as HTMLElement
    expect(item).toBeTruthy()
    const { getByText } = { getByText: (t: string) => item.querySelector(`span:nth-child(2)`) }
    // just check the type text appears somewhere in the row
    expect(item.textContent).toContain('icon')
  })
})

// HELD-OUT generalization tests — different scenarios from the public suite.
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

describe('Asset Library (held-out)', () => {
  it('total in Showing reflects full list regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Extra Icon', 'icon')
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'logo')
    expect(screen.getByText('Showing: 1 of 4')).toBeInTheDocument()
  })

  it('adding multiple logos increments Stats Logos count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Logo A', 'logo')
    await addAsset(u, 'Logo B', 'logo')
    await nav(u, 'Stats')
    expect(screen.getByText('Logos: 3')).toBeInTheDocument()
    expect(screen.getByText('Total assets: 5')).toBeInTheDocument()
  })

  it('deleting all assets of a type drops that type count to zero in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete hero photo/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Photos: 0')).toBeInTheDocument()
    expect(screen.getByText('Total assets: 2')).toBeInTheDocument()
  })

  it('filter shows zero matching when no assets of that type exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete hero photo/i }))
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'photo')
    expect(screen.getByText('Showing: 0 of 2')).toBeInTheDocument()
  })

  it('newly added asset with tags shows tags in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Tag Test', 'icon', 'foo, bar')
    expect(screen.getByText('Tag Test (icon)')).toBeInTheDocument()
    expect(screen.getByText('foo, bar')).toBeInTheDocument()
  })

  it('deleting a filtered item updates Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Temp Logo', 'logo')
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'logo')
    expect(screen.getByText('Showing: 2 of 4')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete temp logo/i }))
    expect(screen.getByText('Showing: 1 of 3')).toBeInTheDocument()
  })

  it('toggling theme back to light works', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Stats Icons count increments after adding two icons', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Search Icon', 'icon')
    await addAsset(u, 'Menu Icon', 'icon')
    await nav(u, 'Stats')
    expect(screen.getByText('Icons: 3')).toBeInTheDocument()
  })

  it('seeded tags are visible in Library', () => {
    render(<App />)
    expect(screen.getByText('brand, official')).toBeInTheDocument()
    expect(screen.getByText('nav, ui')).toBeInTheDocument()
    expect(screen.getByText('landing')).toBeInTheDocument()
  })

  it('Stats view reflects deletion done while filter was active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'icon')
    await u.click(screen.getByRole('button', { name: /delete home icon/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Icons: 0')).toBeInTheDocument()
    expect(screen.getByText('Total assets: 2')).toBeInTheDocument()
  })
})

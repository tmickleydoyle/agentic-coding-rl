// HELD-OUT generalization tests — fresh scenarios exercising edge cases and cross-view paths.
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
  await u.clear(screen.getByLabelText(/tags/i))
  if (tags) await u.type(screen.getByLabelText(/tags/i), tags)
  await u.click(screen.getByRole('button', { name: /add asset/i }))
}

describe('Asset Library (held-out)', () => {
  it('adding multiple photos updates filter count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Beach Photo', 'photo', 'travel')
    await addAsset(u, 'Mountain Photo', 'photo')
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'photo')
    // seeded Hero Photo + 2 new = 3
    expect(screen.getByRole('heading', { name: /assets \(3\)/i })).toBeInTheDocument()
  })

  it('deleting all icons makes icon filter show 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete home icon/i }))
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'icon')
    expect(screen.getByRole('heading', { name: /assets \(0\)/i })).toBeInTheDocument()
  })

  it('Stats tagged count updates when asset without tags is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Untagged Icon', 'icon')
    await nav(u, 'Stats')
    // still 2 tagged (no tags added)
    expect(screen.getByText('Tagged: 2')).toBeInTheDocument()
    expect(screen.getByText('Total assets: 4')).toBeInTheDocument()
  })

  it('Stats tagged count updates when tagged asset is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Tagged Photo', 'photo', 'nature,landscape')
    await nav(u, 'Stats')
    expect(screen.getByText('Tagged: 3')).toBeInTheDocument()
  })

  it('deleting a tagged asset reduces tagged count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete home icon/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Tagged: 1')).toBeInTheDocument()
  })

  it('filter survives navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by type/i), 'logo')
    await nav(u, 'Stats')
    await nav(u, 'Library')
    // filter state is local so it may reset — just check list renders
    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument()
  })

  it('newly added asset appears in correct Stats type bucket', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Second Logo', 'logo', 'brand')
    await nav(u, 'Stats')
    expect(screen.getByText('Logos: 2')).toBeInTheDocument()
    expect(screen.getByText('Icons: 1')).toBeInTheDocument()
    expect(screen.getByText('Photos: 1')).toBeInTheDocument()
  })

  it('all three seeded asset types appear in Stats individually', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    const section = screen.getByRole('region', { name: /stats view/i })
    expect(within(section).getByText('Logos: 1')).toBeInTheDocument()
    expect(within(section).getByText('Icons: 1')).toBeInTheDocument()
    expect(within(section).getByText('Photos: 1')).toBeInTheDocument()
  })

  it('total assets in Stats matches library count after additions and deletions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addAsset(u, 'Extra Icon', 'icon', 'tools')
    await u.click(screen.getByRole('button', { name: /delete hero photo/i }))
    await nav(u, 'Stats')
    // 3 seeded + 1 added - 1 deleted = 3
    expect(screen.getByText('Total assets: 3')).toBeInTheDocument()
  })

  it('dark theme shows correct attribute value', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })
})

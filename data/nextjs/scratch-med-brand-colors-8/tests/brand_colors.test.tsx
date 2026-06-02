import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addColor(u: U, name: string, hex: string) {
  await u.clear(screen.getByLabelText(/color name/i))
  await u.type(screen.getByLabelText(/color name/i), name)
  await u.clear(screen.getByLabelText(/hex code/i))
  await u.type(screen.getByLabelText(/hex code/i), hex)
  await u.click(screen.getByRole('button', { name: /add color/i }))
}

describe('Brand Color Manager', () => {
  it('starts on the Colors view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Colors' })).toBeInTheDocument()
  })

  it('seeds three initial colors', () => {
    render(<App />)
    expect(screen.getByText('Midnight Blue')).toBeInTheDocument()
    expect(screen.getByText('Coral')).toBeInTheDocument()
    expect(screen.getByText('Mint')).toBeInTheDocument()
  })

  it('shows Total colors: 3 on initial load', () => {
    render(<App />)
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('shows hex codes for seeded colors', () => {
    render(<App />)
    expect(screen.getByText('#003153')).toBeInTheDocument()
    expect(screen.getByText('#FF6B6B')).toBeInTheDocument()
    expect(screen.getByText('#98FF98')).toBeInTheDocument()
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

  it('navigates back to Colors view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Colors')
    expect(screen.getByRole('heading', { name: 'Colors' })).toBeInTheDocument()
  })

  it('adds a new color and updates total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Ocean', '#006994')
    expect(screen.getByText('Ocean')).toBeInTheDocument()
    expect(screen.getByText('#006994')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 4')).toBeInTheDocument()
  })

  it('ignores entry when color name is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/hex code/i))
    await u.type(screen.getByLabelText(/hex code/i), '#AABBCC')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('ignores entry when hex code is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/color name/i))
    await u.type(screen.getByLabelText(/color name/i), 'Ghost')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('deletes a color and updates total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete coral/i }))
    expect(screen.queryByText('Coral')).not.toBeInTheDocument()
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('clears inputs after adding a color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Lime', '#00FF00')
    expect(screen.getByLabelText(/color name/i)).toHaveValue('')
    expect(screen.getByLabelText(/hex code/i)).toHaveValue('')
  })

  it('Stats shows total and unique hex counts for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
    expect(screen.getByText('Unique hex codes: 3')).toBeInTheDocument()
  })

  it('Stats reflects added color cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Sunflower', '#FFD700')
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 4')).toBeInTheDocument()
    expect(screen.getByText('Unique hex codes: 4')).toBeInTheDocument()
  })

  it('Stats shows duplicate hex count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Coral Copy', '#FF6B6B')
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 4')).toBeInTheDocument()
    expect(screen.getByText('Unique hex codes: 3')).toBeInTheDocument()
  })

  it('Stats reflects deleted color cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete mint/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('Stats shows no colors message when all are deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete midnight blue/i }))
    await u.click(screen.getByRole('button', { name: /delete coral/i }))
    await u.click(screen.getByRole('button', { name: /delete mint/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('No colors added yet.')).toBeInTheDocument()
  })

  it('toggles theme via Settings and applies data-theme', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Colors')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('filter short hex hides entries with hex of 4 chars or fewer', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'White', '#fff')
    expect(screen.getByText('White')).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/filter short hex/i))
    await nav(u, 'Colors')
    expect(screen.queryByText('White')).not.toBeInTheDocument()
  })

  it('filter short hex does not hide normal hex entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/filter short hex/i))
    await nav(u, 'Colors')
    expect(screen.getByText('Midnight Blue')).toBeInTheDocument()
    expect(screen.getByText('Coral')).toBeInTheDocument()
    expect(screen.getByText('Mint')).toBeInTheDocument()
  })

  it('hidden short hex entries still counted in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'White', '#fff')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/filter short hex/i))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 4')).toBeInTheDocument()
  })

  it('Total colors on Colors view always reflects true count even when filter is on', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Blk', '#000')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/filter short hex/i))
    await nav(u, 'Colors')
    expect(screen.getByText('Total colors: 4')).toBeInTheDocument()
  })

  it('color state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Violet', '#8000FF')
    await nav(u, 'Stats')
    await nav(u, 'Colors')
    expect(screen.getByText('Violet')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 4')).toBeInTheDocument()
  })
})

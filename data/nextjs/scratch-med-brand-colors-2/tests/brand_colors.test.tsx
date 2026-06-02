import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Brand Color Manager', () => {
  it('starts on the Colors view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /total colors:/i })).toBeInTheDocument()
  })

  it('seeds two colors on load', () => {
    render(<App />)
    expect(screen.getByText('Primary Blue')).toBeInTheDocument()
    expect(screen.getByText('Accent Green')).toBeInTheDocument()
    expect(screen.getByText('#0057FF')).toBeInTheDocument()
    expect(screen.getByText('#00C48C')).toBeInTheDocument()
  })

  it('shows Total colors: 2 initially', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Total colors: 2' })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: /total colors:/i })).toBeInTheDocument()
  })

  it('adds a new color and updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Color name'), 'Brand Red')
    await u.type(screen.getByLabelText('Hex code'), '#FF0000')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByText('Brand Red')).toBeInTheDocument()
    expect(screen.getByText('#FF0000')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Total colors: 3' })).toBeInTheDocument()
  })

  it('ignores an add with blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Hex code'), '#123456')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByRole('heading', { name: 'Total colors: 2' })).toBeInTheDocument()
  })

  it('ignores an add with blank hex', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Color name'), 'Ghost')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByRole('heading', { name: 'Total colors: 2' })).toBeInTheDocument()
  })

  it('clears inputs after adding a color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Color name'), 'Temp')
    await u.type(screen.getByLabelText('Hex code'), '#AABBCC')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByLabelText('Color name')).toHaveValue('')
    expect(screen.getByLabelText('Hex code')).toHaveValue('')
  })

  it('deletes a color and updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Primary Blue' }))
    expect(screen.queryByText('Primary Blue')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Total colors: 1' })).toBeInTheDocument()
  })

  it('shows a swatch for each seeded color', () => {
    render(<App />)
    expect(screen.getByLabelText('Swatch for Primary Blue')).toBeInTheDocument()
    expect(screen.getByLabelText('Swatch for Accent Green')).toBeInTheDocument()
  })

  it('Stats shows Total colors: 2 from seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('Stats shows Unique hex codes: 2 from seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Unique hex codes: 2')).toBeInTheDocument()
  })

  it('Stats shows most recent from seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Accent Green')).toBeInTheDocument()
  })

  it('Stats updates after adding a color (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Color name'), 'Highlight Yellow')
    await u.type(screen.getByLabelText('Hex code'), '#FFD700')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
    expect(screen.getByText('Most recent: Highlight Yellow')).toBeInTheDocument()
  })

  it('Stats shows Most recent: — when all colors are deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Primary Blue' }))
    await u.click(screen.getByRole('button', { name: 'Delete Accent Green' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: —')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
  })

  it('Stats counts unique hex codes correctly when duplicates exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Color name'), 'Blue Copy')
    await u.type(screen.getByLabelText('Hex code'), '#0057FF')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
    expect(screen.getByText('Unique hex codes: 2')).toBeInTheDocument()
  })

  it('Settings toggles theme and updates the data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating between views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    await nav(u, 'Colors')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Settings button label reflects current theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: 'Toggle theme (current: light)' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: 'Toggle theme (current: dark)' })).toBeInTheDocument()
  })

  it('color list persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Color name'), 'Persist Me')
    await u.type(screen.getByLabelText('Hex code'), '#123ABC')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    await nav(u, 'Stats')
    await nav(u, 'Colors')
    expect(screen.getByText('Persist Me')).toBeInTheDocument()
    expect(screen.getByText('#123ABC')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addColor(u: U, name: string, hex: string) {
  await u.clear(screen.getByLabelText('Color name'))
  await u.type(screen.getByLabelText('Color name'), name)
  await u.clear(screen.getByLabelText('Hex code'))
  await u.type(screen.getByLabelText('Hex code'), hex)
  await u.click(screen.getByRole('button', { name: /add color/i }))
}

describe('Brand Color Manager', () => {
  it('starts on the Palette view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Palette' })).toBeInTheDocument()
  })

  it('seeds three initial colors on load', () => {
    render(<App />)
    expect(screen.getByText('Primary')).toBeInTheDocument()
    expect(screen.getByText('Secondary')).toBeInTheDocument()
    expect(screen.getByText('Neutral')).toBeInTheDocument()
  })

  it('shows Total colors: 3 on load', () => {
    render(<App />)
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
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

  it('navigates back to Palette from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Palette')
    expect(screen.getByRole('heading', { name: 'Palette' })).toBeInTheDocument()
  })

  it('adds a new color and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Accent', '#aabbcc')
    expect(screen.getByText('Accent')).toBeInTheDocument()
    expect(screen.getByText('#aabbcc')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 4')).toBeInTheDocument()
  })

  it('shows a swatch for each seeded color', () => {
    render(<App />)
    expect(screen.getByLabelText('Swatch for Primary')).toBeInTheDocument()
    expect(screen.getByLabelText('Swatch for Secondary')).toBeInTheDocument()
    expect(screen.getByLabelText('Swatch for Neutral')).toBeInTheDocument()
  })

  it('shows a swatch for a newly added color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Highlight', '#ffee00')
    expect(screen.getByLabelText('Swatch for Highlight')).toBeInTheDocument()
  })

  it('ignores a color entry with a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Hex code'))
    await u.type(screen.getByLabelText('Hex code'), '#123456')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('ignores a color entry with a blank hex code', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Color name'))
    await u.type(screen.getByLabelText('Color name'), 'Ghost')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('ignores a hex code that does not start with #', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'BadHex', 'ff0000')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('removes a color and decrements count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Primary' }))
    expect(screen.queryByText('Primary')).not.toBeInTheDocument()
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('filters colors by name case-insensitively', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter colors'), 'sec')
    expect(screen.getByText('Secondary')).toBeInTheDocument()
    expect(screen.queryByText('Primary')).not.toBeInTheDocument()
    expect(screen.queryByText('Neutral')).not.toBeInTheDocument()
  })

  it('Total colors count does not change when filter is active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter colors'), 'primary')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('Stats view shows correct total on load', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('Stats view shows unique hues matching seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Unique hues: 3')).toBeInTheDocument()
  })

  it('Stats view shows the last added color as Most recent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Brand Red', '#dd0000')
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Brand Red')).toBeInTheDocument()
  })

  it('Stats view shows Most recent: — when palette is empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Primary' }))
    await u.click(screen.getByRole('button', { name: 'Remove Secondary' }))
    await u.click(screen.getByRole('button', { name: 'Remove Neutral' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: —')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
  })

  it('Stats updates after adding a color (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Forest', '#228b22')
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 4')).toBeInTheDocument()
    expect(screen.getByText('Most recent: Forest')).toBeInTheDocument()
  })

  it('Stats updates after removing a color (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Neutral' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating between views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Palette')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('palette state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Teal', '#008080')
    await nav(u, 'Stats')
    await nav(u, 'Palette')
    expect(screen.getByText('Teal')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 4')).toBeInTheDocument()
  })
})

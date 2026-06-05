import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Brand Color Manager', () => {
  it('starts on the Colors view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /colors \(3\)/i })).toBeInTheDocument()
  })

  it('shows all three seeded colors', () => {
    render(<App />)
    expect(screen.getByText('Primary')).toBeInTheDocument()
    expect(screen.getByText('Secondary')).toBeInTheDocument()
    expect(screen.getByText('Accent')).toBeInTheDocument()
  })

  it('shows the seeded hex codes', () => {
    render(<App />)
    expect(screen.getByText('#0057FF')).toBeInTheDocument()
    expect(screen.getByText('#FF5733')).toBeInTheDocument()
    expect(screen.getByText('#00C49A')).toBeInTheDocument()
  })

  it('shows swatches for seeded colors', () => {
    render(<App />)
    expect(screen.getByLabelText('Swatch for Primary')).toBeInTheDocument()
    expect(screen.getByLabelText('Swatch for Secondary')).toBeInTheDocument()
    expect(screen.getByLabelText('Swatch for Accent')).toBeInTheDocument()
  })

  it('shows Total colors: 3 initially', () => {
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

  it('navigates back to Colors view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Colors')
    expect(screen.getByRole('heading', { name: /colors \(/i })).toBeInTheDocument()
  })

  it('adds a new color and updates heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Color name'), 'Highlight')
    await u.type(screen.getByLabelText('Hex code'), '#FFFF00')
    await u.click(screen.getByRole('button', { name: 'Add color' }))
    expect(screen.getByRole('heading', { name: /colors \(4\)/i })).toBeInTheDocument()
    expect(screen.getByText('Highlight')).toBeInTheDocument()
    expect(screen.getByText('#FFFF00')).toBeInTheDocument()
  })

  it('shows a swatch for newly added color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Color name'), 'Highlight')
    await u.type(screen.getByLabelText('Hex code'), '#FFFF00')
    await u.click(screen.getByRole('button', { name: 'Add color' }))
    expect(screen.getByLabelText('Swatch for Highlight')).toBeInTheDocument()
  })

  it('ignores blank color name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Hex code'), '#123456')
    await u.click(screen.getByRole('button', { name: 'Add color' }))
    expect(screen.getByRole('heading', { name: /colors \(3\)/i })).toBeInTheDocument()
  })

  it('ignores blank hex code', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Color name'), 'Ghost')
    await u.click(screen.getByRole('button', { name: 'Add color' }))
    expect(screen.getByRole('heading', { name: /colors \(3\)/i })).toBeInTheDocument()
  })

  it('deletes a color entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Primary' }))
    expect(screen.queryByText('Primary')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /colors \(2\)/i })).toBeInTheDocument()
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('Stats view shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
    expect(screen.getByText('Unique hex codes: 3')).toBeInTheDocument()
    expect(screen.getByText('Duplicates: 0')).toBeInTheDocument()
  })

  it('Stats view updates after adding a color (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Color name'), 'Extra')
    await u.type(screen.getByLabelText('Hex code'), '#0057FF')
    await u.click(screen.getByRole('button', { name: 'Add color' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 4')).toBeInTheDocument()
    expect(screen.getByText('Unique hex codes: 3')).toBeInTheDocument()
    expect(screen.getByText('Duplicates: 1')).toBeInTheDocument()
  })

  it('Stats view updates after deleting a color (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Accent' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
    expect(screen.getByText('Unique hex codes: 2')).toBeInTheDocument()
  })

  it('theme starts as light and data-theme attribute is set', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Colors')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('Clear all colors removes every entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: 'Clear all colors' }))
    await nav(u, 'Colors')
    expect(screen.getByRole('heading', { name: /colors \(0\)/i })).toBeInTheDocument()
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
  })

  it('Stats shows zeros after clearing all colors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: 'Clear all colors' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
    expect(screen.getByText('Unique hex codes: 0')).toBeInTheDocument()
    expect(screen.getByText('Duplicates: 0')).toBeInTheDocument()
  })

  it('colors state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Color name'), 'Persisted')
    await u.type(screen.getByLabelText('Hex code'), '#AABBCC')
    await u.click(screen.getByRole('button', { name: 'Add color' }))
    await nav(u, 'Stats')
    await nav(u, 'Colors')
    expect(screen.getByText('Persisted')).toBeInTheDocument()
    expect(screen.getByText('#AABBCC')).toBeInTheDocument()
  })
})

// HELD-OUT generalization tests — fresh scenarios, edge cases, and cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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

describe('Brand Color Manager (held-out)', () => {
  it('inputs are cleared after adding a color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Crimson', '#DC143C')
    expect(screen.getByLabelText('Color name')).toHaveValue('')
    expect(screen.getByLabelText('Hex code')).toHaveValue('')
  })

  it('multiple colors all appear in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Red', '#FF0000')
    await addColor(u, 'Green', '#00FF00')
    await addColor(u, 'Blue', '#0000FF')
    expect(screen.getByText('Red')).toBeInTheDocument()
    expect(screen.getByText('Green')).toBeInTheDocument()
    expect(screen.getByText('Blue')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('swatch aria-label matches the color name exactly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Teal Breeze', '#008080')
    expect(screen.getByLabelText('Swatch for Teal Breeze')).toBeInTheDocument()
  })

  it('deleting one of many colors leaves the others', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Apple', '#00FF00')
    await addColor(u, 'Mango', '#FFAA00')
    await addColor(u, 'Berry', '#8B008B')
    await u.click(screen.getByRole('button', { name: 'Delete Mango' }))
    expect(screen.queryByText('Mango')).not.toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Berry')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('Stats Unique hex codes counts case-insensitively', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Upper', '#ABCDEF')
    await addColor(u, 'Lower', '#abcdef')
    await addColor(u, 'Other', '#123456')
    await nav(u, 'Stats')
    expect(screen.getByText('Unique hex codes: 2')).toBeInTheDocument()
  })

  it('Stats Most recent updates after adding another color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'First Color', '#111111')
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: First Color')).toBeInTheDocument()
    await nav(u, 'Colors')
    await addColor(u, 'Second Color', '#222222')
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Second Color')).toBeInTheDocument()
  })

  it('Stats Total colors stays in sync after delete', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Temp', '#FEDCBA')
    await addColor(u, 'Keep', '#ABCDEF')
    await u.click(screen.getByRole('button', { name: 'Delete Temp' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: 'Toggle theme' }))
    await u.click(screen.getByRole('button', { name: 'Toggle theme' }))
    expect(screen.getByText('Current theme: light')).toBeInTheDocument()
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('data-theme attribute is present on Colors view too', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: 'Toggle theme' }))
    await nav(u, 'Colors')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('all three nav buttons are present on first render', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Colors' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Stats' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })

  it('Stats Unique hex codes: 0 with no colors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Unique hex codes: 0')).toBeInTheDocument()
  })
})

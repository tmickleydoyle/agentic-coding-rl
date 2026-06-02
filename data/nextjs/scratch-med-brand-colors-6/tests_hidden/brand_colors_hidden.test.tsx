// HELD-OUT generalization tests — different scenarios, edge cases, and cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Brand Color Manager (held-out)', () => {
  it('inputs are cleared after adding a color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Color name'), 'Test')
    await u.type(screen.getByLabelText('Hex code'), '#123123')
    await u.click(screen.getByRole('button', { name: 'Add color' }))
    expect(screen.getByLabelText('Color name')).toHaveValue('')
    expect(screen.getByLabelText('Hex code')).toHaveValue('')
  })

  it('duplicate hex codes are counted in Stats Duplicates', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Add two colors with the same hex as Primary seed
    await u.type(screen.getByLabelText('Color name'), 'CopyA')
    await u.type(screen.getByLabelText('Hex code'), '#0057FF')
    await u.click(screen.getByRole('button', { name: 'Add color' }))
    await u.type(screen.getByLabelText('Color name'), 'CopyB')
    await u.type(screen.getByLabelText('Hex code'), '#0057FF')
    await u.click(screen.getByRole('button', { name: 'Add color' }))
    await nav(u, 'Stats')
    // total=5, unique=3 (FF5733, 00C49A, 0057FF), duplicates=2
    expect(screen.getByText('Total colors: 5')).toBeInTheDocument()
    expect(screen.getByText('Unique hex codes: 3')).toBeInTheDocument()
    expect(screen.getByText('Duplicates: 2')).toBeInTheDocument()
  })

  it('deleting one of two duplicate-hex entries adjusts Stats correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Color name'), 'Clone')
    await u.type(screen.getByLabelText('Hex code'), '#FF5733')
    await u.click(screen.getByRole('button', { name: 'Add color' }))
    // now 4 total, 3 unique, 1 duplicate
    await u.click(screen.getByRole('button', { name: 'Delete Clone' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
    expect(screen.getByText('Unique hex codes: 3')).toBeInTheDocument()
    expect(screen.getByText('Duplicates: 0')).toBeInTheDocument()
  })

  it('heading count increments with each added color', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (let i = 1; i <= 3; i++) {
      await u.type(screen.getByLabelText('Color name'), `New${i}`)
      await u.type(screen.getByLabelText('Hex code'), `#00000${i}`)
      await u.click(screen.getByRole('button', { name: 'Add color' }))
    }
    expect(screen.getByRole('heading', { name: /colors \(6\)/i })).toBeInTheDocument()
  })

  it('can toggle theme back to light after switching to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('swatch background color matches the entered hex', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Color name'), 'Ocean')
    await u.type(screen.getByLabelText('Hex code'), '#336699')
    await u.click(screen.getByRole('button', { name: 'Add color' }))
    const swatch = screen.getByLabelText('Swatch for Ocean')
    expect(swatch).toBeInTheDocument()
  })

  it('after clear all, adding a new color works and count is 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: 'Clear all colors' }))
    await nav(u, 'Colors')
    await u.type(screen.getByLabelText('Color name'), 'Fresh')
    await u.type(screen.getByLabelText('Hex code'), '#ABCDEF')
    await u.click(screen.getByRole('button', { name: 'Add color' }))
    expect(screen.getByRole('heading', { name: /colors \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Fresh')).toBeInTheDocument()
    expect(screen.getByText('#ABCDEF')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
  })

  it('deleting all seeded entries one by one reaches zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Primary' }))
    await u.click(screen.getByRole('button', { name: 'Delete Secondary' }))
    await u.click(screen.getByRole('button', { name: 'Delete Accent' }))
    expect(screen.getByRole('heading', { name: /colors \(0\)/i })).toBeInTheDocument()
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
  })

  it('Stats Total colors matches Colors view heading count after multiple ops', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Color name'), 'X')
    await u.type(screen.getByLabelText('Hex code'), '#111111')
    await u.click(screen.getByRole('button', { name: 'Add color' }))
    await u.click(screen.getByRole('button', { name: 'Delete Primary' }))
    // 3 + 1 - 1 = 3
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })
})

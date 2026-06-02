// HELD-OUT generalization tests — fresh sequences not seen during training.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addColor(u: U, name: string, hex: string) {
  await u.clear(screen.getByLabelText('Color name'))
  await u.clear(screen.getByLabelText('Hex code'))
  await u.type(screen.getByLabelText('Color name'), name)
  await u.type(screen.getByLabelText('Hex code'), hex)
  await u.click(screen.getByRole('button', { name: /add color/i }))
}

describe('Brand Color Manager (held-out)', () => {
  it('adds three colors and shows Total colors: 5 on the Colors view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Red', '#FF0000')
    await addColor(u, 'Green', '#00FF00')
    await addColor(u, 'Blue', '#0000FF')
    expect(screen.getByRole('heading', { name: 'Total colors: 5' })).toBeInTheDocument()
  })

  it('Stats total syncs after deleting a seeded color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Accent Green' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
  })

  it('Stats most recent updates after deleting the last item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'New Color', '#ABCDEF')
    await u.click(screen.getByRole('button', { name: 'Delete New Color' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Accent Green')).toBeInTheDocument()
  })

  it('unique hex count is 1 when all entries share the same hex', async () => {
    const u = userEvent.setup()
    render(<App />)
    // delete seeds first
    await u.click(screen.getByRole('button', { name: 'Delete Primary Blue' }))
    await u.click(screen.getByRole('button', { name: 'Delete Accent Green' }))
    await addColor(u, 'Copy A', '#FF00FF')
    await addColor(u, 'Copy B', '#FF00FF')
    await addColor(u, 'Copy C', '#FF00FF')
    await nav(u, 'Stats')
    expect(screen.getByText('Unique hex codes: 1')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('swatch appears for a newly added color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Lavender', '#E6E6FA')
    expect(screen.getByLabelText('Swatch for Lavender')).toBeInTheDocument()
  })

  it('ignoring blank both fields leaves count at 2', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add color/i }))
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByRole('heading', { name: 'Total colors: 2' })).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Colors view heading reflects zero after deleting all entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Primary Blue' }))
    await u.click(screen.getByRole('button', { name: 'Delete Accent Green' }))
    expect(screen.getByRole('heading', { name: 'Total colors: 0' })).toBeInTheDocument()
  })

  it('Stats Unique hex codes: 0 when no colors exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Primary Blue' }))
    await u.click(screen.getByRole('button', { name: 'Delete Accent Green' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Unique hex codes: 0')).toBeInTheDocument()
  })

  it('colors added are shown in insertion order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'First', '#111111')
    await addColor(u, 'Second', '#222222')
    const items = screen.getAllByRole('listitem')
    const names = items.map((li) => within(li).queryByText(/First|Second|Primary Blue|Accent Green/)?.textContent)
    const firstIdx = names.indexOf('Primary Blue')
    const lastIdx = names.indexOf('Second')
    expect(firstIdx).toBeLessThan(lastIdx)
  })
})

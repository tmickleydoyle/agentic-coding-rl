// HELD-OUT generalization tests — fresh scenarios, edge cases, and cross-view paths.
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

describe('Brand Color Manager (held-out)', () => {
  it('can add three colors and all appear in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Tomato', '#FF6347')
    await addColor(u, 'Slate', '#708090')
    await addColor(u, 'Lime', '#00FF00')
    expect(screen.getByText('Tomato')).toBeInTheDocument()
    expect(screen.getByText('Slate')).toBeInTheDocument()
    expect(screen.getByText('Lime')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('deletes the correct color when multiple exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Alpha', '#AA0000')
    await addColor(u, 'Beta', '#00AA00')
    await addColor(u, 'Gamma', '#0000AA')
    await u.click(screen.getByRole('button', { name: 'Delete Beta' }))
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('swatch aria-label matches the color name exactly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Midnight Blue', '#191970')
    expect(screen.getByLabelText('Swatch for Midnight Blue')).toBeInTheDocument()
  })

  it('Stats Unique hex codes counts case-insensitively', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Upper', '#AABBCC')
    await addColor(u, 'Lower', '#aabbcc')
    await nav(u, 'Stats')
    expect(screen.getByText('Unique hex codes: 1')).toBeInTheDocument()
  })

  it('Most recent updates to the latest addition', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'First', '#111111')
    await addColor(u, 'Second', '#222222')
    await addColor(u, 'Third', '#333333')
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Third')).toBeInTheDocument()
  })

  it('Most recent updates after deletion leaves remaining last color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'A', '#AAAAAA')
    await addColor(u, 'B', '#BBBBBB')
    await u.click(screen.getByRole('button', { name: 'Delete B' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: A')).toBeInTheDocument()
  })

  it('Stats Most recent shows — after all colors deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Solo', '#FEDCBA')
    await u.click(screen.getByRole('button', { name: 'Delete Solo' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: —')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
  })

  it('hex code not starting with # is rejected even with valid name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'NoHash', 'FF0000')
    expect(screen.queryByText('NoHash')).not.toBeInTheDocument()
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
  })

  it('Stats Unique hex codes is 0 when list is empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Unique hex codes: 0')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('theme persists across Colors and Stats views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Colors')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('all three nav buttons are present', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Colors' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Stats' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })

  it('adding a color with only spaces in name is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/color name/i), '   ')
    await u.type(screen.getByLabelText(/hex code/i), '#FFFFFF')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
  })
})

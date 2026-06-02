import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addObjective(u: U, title: string) {
  await u.clear(screen.getByLabelText(/objective title/i))
  await u.type(screen.getByLabelText(/objective title/i), title)
  await u.click(screen.getByRole('button', { name: /add objective/i }))
}

async function setProgress(u: U, title: string, value: string) {
  const input = screen.getByLabelText(`Set progress for ${title}`)
  await u.clear(input)
  await u.type(input, value)
  const li = input.closest('li') as HTMLElement
  await u.click(within(li).getByRole('button', { name: /^update$/i }))
}

describe('OKR Tracker (held-out)', () => {
  it('boundary: progress exactly 70 is On Track', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Boundary obj')
    await setProgress(u, 'Boundary obj', '70')
    expect(screen.getByText(/On Track/)).toBeInTheDocument()
    expect(screen.queryByText(/Off Track/)).not.toBeInTheDocument()
  })

  it('boundary: progress 69 is Off Track', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Near miss')
    await setProgress(u, 'Near miss', '69')
    expect(screen.getByText(/Off Track/)).toBeInTheDocument()
  })

  it('deleting an objective updates dashboard total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Keep me')
    await addObjective(u, 'Delete me')
    await u.click(screen.getByRole('button', { name: /delete delete me/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 1')).toBeInTheDocument()
  })

  it('deleting an on-track objective reduces on track count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Star')
    await addObjective(u, 'Weak')
    await setProgress(u, 'Star', '90')
    await setProgress(u, 'Weak', '40')
    await u.click(screen.getByRole('button', { name: /delete star/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
    expect(screen.getByText('Off track: 1')).toBeInTheDocument()
  })

  it('filter can be toggled off to restore all objectives', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Visible')
    await addObjective(u, 'Hidden')
    await setProgress(u, 'Visible', '80')
    await setProgress(u, 'Hidden', '30')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/filter: on track only/i))
    await nav(u, 'Objectives')
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/filter: on track only/i))
    await nav(u, 'Objectives')
    expect(screen.getByText('Hidden')).toBeInTheDocument()
  })

  it('multiple objectives each show their own progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'First')
    await addObjective(u, 'Second')
    await setProgress(u, 'First', '40')
    await setProgress(u, 'Second', '85')
    const items = screen.getAllByText(/Progress:/)
    const texts = items.map((el) => el.textContent)
    expect(texts).toContain('Progress: 40%')
    expect(texts).toContain('Progress: 85%')
  })

  it('average progress is 0% after all objectives deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Solo')
    await setProgress(u, 'Solo', '60')
    await u.click(screen.getByRole('button', { name: /delete solo/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 0%')).toBeInTheDocument()
    expect(screen.getByText('Total objectives: 0')).toBeInTheDocument()
  })

  it('updating progress to 100 marks On Track and reflects in dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'Complete')
    await setProgress(u, 'Complete', '100')
    expect(screen.getByText(/On Track/)).toBeInTheDocument()
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 100%')).toBeInTheDocument()
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
  })

  it('theme toggle button label shows current theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /current: light/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /current: dark/i })).toBeInTheDocument()
  })

  it('dashboard off track includes new objectives at 0%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addObjective(u, 'New one')
    await addObjective(u, 'New two')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Off track: 2')).toBeInTheDocument()
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
  })
})

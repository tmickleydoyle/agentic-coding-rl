import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Bug Triage (held-out)', () => {
  it('seeded high bug appears in Open high count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Open high: 1')).toBeInTheDocument()
  })

  it('adding a high severity bug increments Open high in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'Critical crash')
    await u.selectOptions(screen.getByLabelText('Severity'), 'high')
    await u.click(screen.getByRole('button', { name: 'Add Bug' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open high: 2')).toBeInTheDocument()
    expect(screen.getByText('Total bugs: 4')).toBeInTheDocument()
  })

  it('reopening the closed seeded bug changes Stats Closed and Open', async () => {
    const u = userEvent.setup()
    render(<App />)
    const footerRow = screen.getByText('Typo in footer').closest('li') as HTMLElement
    await u.click(within(footerRow).getByRole('button', { name: 'Reopen' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open: 3')).toBeInTheDocument()
    expect(screen.getByText('Closed: 0')).toBeInTheDocument()
    expect(screen.getByText('Open low: 1')).toBeInTheDocument()
  })

  it('closing all open bugs results in Open: 0 in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    const loginRow = screen.getByText('Login page crash').closest('li') as HTMLElement
    await u.click(within(loginRow).getByRole('button', { name: 'Close' }))
    const dashRow = screen.getByText('Slow dashboard load').closest('li') as HTMLElement
    await u.click(within(dashRow).getByRole('button', { name: 'Close' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('Closed: 3')).toBeInTheDocument()
    expect(screen.getByText('Open high: 0')).toBeInTheDocument()
    expect(screen.getByText('Open medium: 0')).toBeInTheDocument()
  })

  it('Closed filter shows Showing: 1 bugs for the seeded closed bug', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Closed' }))
    expect(screen.getByText('Showing: 1 bugs')).toBeInTheDocument()
  })

  it('adding a low severity bug and then closing it moves it out of Open low', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'Minor glitch')
    await u.selectOptions(screen.getByLabelText('Severity'), 'low')
    await u.click(screen.getByRole('button', { name: 'Add Bug' }))
    const glitchRow = screen.getByText('Minor glitch').closest('li') as HTMLElement
    await u.click(within(glitchRow).getByRole('button', { name: 'Close' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open low: 0')).toBeInTheDocument()
    expect(screen.getByText('Closed: 2')).toBeInTheDocument()
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

  it('Open filter count updates after a new open bug is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByText('Showing: 2 bugs')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'All' }))
    await u.type(screen.getByLabelText('Title'), 'New open issue')
    await u.click(screen.getByRole('button', { name: 'Add Bug' }))
    await u.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByText('Showing: 3 bugs')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function itemRow(title: string): HTMLElement {
  const el = screen.getByText(title).closest('li')
  if (!el) throw new Error(`no row for ${title}`)
  return el as HTMLElement
}

async function addItem(u: U, title: string) {
  await u.clear(screen.getByLabelText(/new item/i))
  await u.type(screen.getByLabelText(/new item/i), title)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Handoff Checklist (held-out)', () => {
  it('Remaining decrements for each item marked done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done write readme/i }))
    await u.click(within(itemRow('Deploy to staging')).getByRole('button', { name: /mark done deploy to staging/i }))
    expect(screen.getByRole('heading', { name: /remaining: 1/i })).toBeInTheDocument()
  })

  it('Remaining goes back up when undone', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done write readme/i }))
    await u.click(within(itemRow('Record demo video')).getByRole('button', { name: /mark done record demo video/i }))
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark undone write readme/i }))
    expect(screen.getByRole('heading', { name: /remaining: 2/i })).toBeInTheDocument()
  })

  it('adding a new item increments Remaining', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Notify stakeholders')
    expect(screen.getByRole('heading', { name: /remaining: 4/i })).toBeInTheDocument()
  })

  it('deleting a done item updates Remaining correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /mark done write readme/i }))
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /delete write readme/i }))
    expect(screen.getByRole('heading', { name: /remaining: 2/i })).toBeInTheDocument()
  })

  it('Pending filter shows only undone items after some are marked done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Record demo video')).getByRole('button', { name: /mark done record demo video/i }))
    await u.click(within(itemRow('Deploy to staging')).getByRole('button', { name: /mark done deploy to staging/i }))
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.getByText('Write README')).toBeInTheDocument()
    expect(screen.queryByText('Record demo video')).not.toBeInTheDocument()
    expect(screen.queryByText('Deploy to staging')).not.toBeInTheDocument()
  })

  it('Done filter shows nothing when nothing is done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.queryByText('Write README')).not.toBeInTheDocument()
    expect(screen.queryByText('Record demo video')).not.toBeInTheDocument()
  })

  it('Summary shows 33% completion for one of three done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Deploy to staging')).getByRole('button', { name: /mark done deploy to staging/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('Summary updates after adding and completing a new item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Close tickets')
    await u.click(within(itemRow('Close tickets')).getByRole('button', { name: /mark done close tickets/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 25%')).toBeInTheDocument()
  })

  it('Summary shows 0% when there are no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Write README')).getByRole('button', { name: /delete write readme/i }))
    await u.click(within(itemRow('Record demo video')).getByRole('button', { name: /delete record demo video/i }))
    await u.click(within(itemRow('Deploy to staging')).getByRole('button', { name: /delete deploy to staging/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('theme toggles back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('items added while Done filter is active appear when switching to All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Done' }))
    await addItem(u, 'Write tests')
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Write tests')).toBeInTheDocument()
  })
})

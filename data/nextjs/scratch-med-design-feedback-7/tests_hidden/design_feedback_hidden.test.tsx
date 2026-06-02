import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, screenName: string) {
  await u.clear(screen.getByLabelText('Note'))
  await u.type(screen.getByLabelText('Note'), note)
  await u.clear(screen.getByLabelText('Screen'))
  await u.type(screen.getByLabelText('Screen'), screenName)
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

describe('Design Feedback Tracker (held-out)', () => {
  it('adding three items shows heading Feedback (3)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Note1', 'PageA')
    await addFeedback(u, 'Note2', 'PageB')
    await addFeedback(u, 'Note3', 'PageC')
    expect(screen.getByRole('heading', { name: 'Feedback (3)' })).toBeInTheDocument()
  })

  it('marking all items addressed yields Addressed rate: 100%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Fix it', 'Home')
    await addFeedback(u, 'Tweak it', 'About')
    const btns = screen.getAllByRole('button', { name: /mark addressed/i })
    for (let i = 0; i < btns.length; i++) {
      await u.click(btns[i])
    }
    await nav(u, 'Summary')
    expect(screen.getByText('Addressed rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
  })

  it('filter with all items open shows all items in heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Alpha', 'S1')
    await addFeedback(u, 'Beta', 'S2')
    await u.click(screen.getByLabelText('Show open only'))
    expect(screen.getByRole('heading', { name: 'Feedback (2)' })).toBeInTheDocument()
  })

  it('addressed item does not appear under Show open only filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Gone', 'PageX')
    await addFeedback(u, 'Still here', 'PageY')
    await u.click(screen.getAllByRole('button', { name: /mark addressed/i })[0])
    await u.click(screen.getByLabelText('Show open only'))
    expect(screen.queryByText('Gone')).not.toBeInTheDocument()
    expect(screen.getByText('Still here')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Feedback (1)' })).toBeInTheDocument()
  })

  it('Summary Open count stays correct after multiple addresses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'P', 'S1')
    await addFeedback(u, 'Q', 'S2')
    await addFeedback(u, 'R', 'S3')
    await u.click(screen.getAllByRole('button', { name: /mark addressed/i })[0])
    await u.click(screen.getAllByRole('button', { name: /mark addressed/i })[0])
    await nav(u, 'Summary')
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 2')).toBeInTheDocument()
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('clearing inputs after add leaves Note and Screen empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Cleared', 'PageZ')
    expect(screen.getByLabelText('Note')).toHaveValue('')
    expect(screen.getByLabelText('Screen')).toHaveValue('')
  })

  it('screen name appears alongside the note in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Drop shadow missing', 'Cards')
    const view = screen.getByRole('region', { name: 'Feedback view' })
    expect(within(view).getByText('Drop shadow missing')).toBeInTheDocument()
    expect(within(view).getByText('Cards')).toBeInTheDocument()
  })

  it('Summary total does not count filter, only all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'One', 'S1')
    await addFeedback(u, 'Two', 'S2')
    await u.click(screen.getAllByRole('button', { name: /mark addressed/i })[0])
    await u.click(screen.getByLabelText('Show open only'))
    // filter is on — heading shows 1
    expect(screen.getByRole('heading', { name: 'Feedback (1)' })).toBeInTheDocument()
    await nav(u, 'Summary')
    // summary always counts all items
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
  })
})

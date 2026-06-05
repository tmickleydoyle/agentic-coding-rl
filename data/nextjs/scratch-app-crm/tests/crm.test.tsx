import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const col = (name: string) => screen.getByRole('region', { name })

async function addContact(u: U, name: string, company = 'Acme', amount = '0') {
  await u.clear(screen.getByLabelText(/^name$/i))
  await u.type(screen.getByLabelText(/^name$/i), name)
  await u.clear(screen.getByLabelText(/^company$/i))
  await u.type(screen.getByLabelText(/^company$/i), company)
  await u.clear(screen.getByLabelText(/^amount$/i))
  if (amount) await u.type(screen.getByLabelText(/^amount$/i), amount)
  await u.click(screen.getByRole('button', { name: /add contact/i }))
}
function card(name: string): HTMLElement {
  const li = screen.getByText(name).closest('li')
  if (!li) throw new Error(`no card for ${name}`)
  return li as HTMLElement
}

describe('CRM app', () => {
  it('starts on Contacts', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Contacts' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByRole('heading', { name: 'Pipeline' })).toBeInTheDocument()
    await nav(u, 'Reports')
    expect(screen.getByRole('heading', { name: 'Reports' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Contacts')
    expect(screen.getByRole('heading', { name: 'Contacts' })).toBeInTheDocument()
  })

  it('adds a contact rendered as Name — Company ($Amount)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addContact(u, 'Jane Doe', 'Globex', '5000')
    expect(screen.getByText('Jane Doe — Globex ($5000)')).toBeInTheDocument()
  })

  it('ignores a contact with a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add contact/i }))
    await nav(u, 'Reports')
    expect(screen.getByText(/total contacts: 0/i)).toBeInTheDocument()
  })

  it('puts a new contact in the Lead column (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addContact(u, 'Lead Person')
    await nav(u, 'Pipeline')
    expect(within(col('Lead')).getByText('Lead Person')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /lead \(1\)/i })).toBeInTheDocument()
  })

  it('advances and regresses a deal across stages with disabled bounds', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addContact(u, 'Deal A')
    await nav(u, 'Pipeline')
    expect(within(card('Deal A')).getByRole('button', { name: /regress deal a/i })).toBeDisabled()
    await u.click(within(card('Deal A')).getByRole('button', { name: /advance deal a/i }))
    expect(within(col('Qualified')).getByText('Deal A')).toBeInTheDocument()
    await u.click(within(card('Deal A')).getByRole('button', { name: /advance deal a/i }))
    expect(within(col('Won')).getByText('Deal A')).toBeInTheDocument()
    expect(within(card('Deal A')).getByRole('button', { name: /advance deal a/i })).toBeDisabled()
    await u.click(within(card('Deal A')).getByRole('button', { name: /regress deal a/i }))
    expect(within(col('Qualified')).getByText('Deal A')).toBeInTheDocument()
  })

  it('computes reports: counts, win rate, and values', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addContact(u, 'One', 'A', '1000')
    await addContact(u, 'Two', 'B', '3000')
    await nav(u, 'Pipeline')
    await u.click(within(card('One')).getByRole('button', { name: /advance one/i }))
    await u.click(within(card('One')).getByRole('button', { name: /advance one/i })) // One -> Won
    await nav(u, 'Reports')
    expect(screen.getByText(/total contacts: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/won: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/win rate: 50%/i)).toBeInTheDocument()
    expect(screen.getByText(/pipeline value: \$4000/i)).toBeInTheDocument()
    expect(screen.getByText(/won value: \$1000/i)).toBeInTheDocument()
  })

  it('toggles theme via data-theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Pipeline')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hides Won cards when Show won is off but keeps them counted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addContact(u, 'Closer')
    await nav(u, 'Pipeline')
    await u.click(within(card('Closer')).getByRole('button', { name: /advance closer/i }))
    await u.click(within(card('Closer')).getByRole('button', { name: /advance closer/i }))
    expect(within(col('Won')).getByText('Closer')).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show won/i))
    await nav(u, 'Pipeline')
    expect(within(col('Won')).queryByText('Closer')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /won \(1\)/i })).toBeInTheDocument()
  })

  it('preserves contacts when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addContact(u, 'Persistent', 'Acme', '10')
    await nav(u, 'Settings')
    await nav(u, 'Contacts')
    expect(screen.getByText('Persistent — Acme ($10)')).toBeInTheDocument()
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Org Chart', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /org chart/i })).toBeInTheDocument()
  })

  it('shows all 7 seed members', () => {
    expect(screen.getAllByTestId('org-node')).toHaveLength(7)
  })

  it('shows member count', () => {
    expect(screen.getByTestId('member-count')).toHaveTextContent('7')
  })

  it('displays CEO at root', () => {
    const names = screen.getAllByTestId('org-name').map(el => el.textContent)
    expect(names).toContain('Sandra Hill')
  })

  it('shows name and title for nodes', () => {
    const titles = screen.getAllByTestId('org-title').map(el => el.textContent)
    expect(titles).toContain('CEO')
    expect(titles).toContain('VP Engineering')
  })

  it('collapses a node when toggle clicked', async () => {
    const user = userEvent.setup()
    // Sandra Hill (CEO) has children, click her toggle
    const toggles = screen.getAllByTestId('org-toggle')
    // First toggle is root node (Sandra Hill)
    await user.click(toggles[0])
    // After collapse, only the root node is visible
    expect(screen.getAllByTestId('org-node')).toHaveLength(1)
  })

  it('expands a collapsed node', async () => {
    const user = userEvent.setup()
    const toggles = screen.getAllByTestId('org-toggle')
    await user.click(toggles[0]) // collapse root
    expect(screen.getAllByTestId('org-node')).toHaveLength(1)
    await user.click(screen.getByTestId('org-toggle')) // expand root
    expect(screen.getAllByTestId('org-node').length).toBeGreaterThan(1)
  })

  it('toggle button shows + when collapsed, - when expanded', async () => {
    const user = userEvent.setup()
    const toggles = screen.getAllByTestId('org-toggle')
    expect(toggles[0]).toHaveTextContent('-')
    await user.click(toggles[0])
    expect(screen.getByTestId('org-toggle')).toHaveTextContent('+')
  })

  it('shows add form when Add Member clicked', async () => {
    const user = userEvent.setup()
    expect(screen.queryByTestId('add-form')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /add member/i }))
    expect(screen.getByTestId('add-form')).toBeInTheDocument()
  })

  it('adds a new member under selected manager', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add member/i }))
    await user.type(screen.getByLabelText(/^name$/i), 'Sam Green')
    await user.type(screen.getByLabelText(/^title$/i), 'Intern')
    await user.selectOptions(screen.getByLabelText(/^manager$/i), 'Tom Baker')
    await user.click(screen.getByRole('button', { name: /^add$/i }))
    expect(screen.getAllByTestId('org-node')).toHaveLength(8)
    expect(screen.getByTestId('member-count')).toHaveTextContent('8')
    const names = screen.getAllByTestId('org-name').map(el => el.textContent)
    expect(names).toContain('Sam Green')
  })

  it('cancel hides form without adding', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add member/i }))
    await user.type(screen.getByLabelText(/^name$/i), 'Ghost')
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByTestId('add-form')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('org-node')).toHaveLength(7)
  })

  it('does not add member with empty name', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add member/i }))
    await user.type(screen.getByLabelText(/^title$/i), 'Some Title')
    await user.selectOptions(screen.getByLabelText(/^manager$/i), 'Sandra Hill')
    await user.click(screen.getByRole('button', { name: /^add$/i }))
    expect(screen.getByTestId('add-form')).toBeInTheDocument()
    expect(screen.getAllByTestId('org-node')).toHaveLength(7)
  })
})

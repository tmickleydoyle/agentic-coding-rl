import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModalDialog from '../components/ModalDialog'

describe('ModalDialog', () => {
  it('renders the open button', () => {
    render(<ModalDialog title="Hello" body="World" />)
    expect(screen.getByTestId('open-modal')).toBeDefined()
  })

  it('modal is not visible initially', () => {
    render(<ModalDialog title="Hello" body="World" />)
    expect(screen.queryByTestId('modal-dialog')).toBeNull()
  })

  it('opens modal when trigger button is clicked', async () => {
    const user = userEvent.setup()
    render(<ModalDialog title="Hello" body="World" />)
    await user.click(screen.getByTestId('open-modal'))
    expect(screen.getByTestId('modal-dialog')).toBeDefined()
  })

  it('displays title and body in modal', async () => {
    const user = userEvent.setup()
    render(<ModalDialog title="My Title" body="My Body" />)
    await user.click(screen.getByTestId('open-modal'))
    expect(screen.getByTestId('modal-title').textContent).toContain('My Title')
    expect(screen.getByTestId('modal-body').textContent).toContain('My Body')
  })

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<ModalDialog title="Hello" body="World" />)
    await user.click(screen.getByTestId('open-modal'))
    await user.click(screen.getByTestId('close-modal'))
    expect(screen.queryByTestId('modal-dialog')).toBeNull()
  })

  it('closes modal when overlay is clicked', async () => {
    const user = userEvent.setup()
    render(<ModalDialog title="Hello" body="World" />)
    await user.click(screen.getByTestId('open-modal'))
    await user.click(screen.getByTestId('modal-overlay'))
    expect(screen.queryByTestId('modal-dialog')).toBeNull()
  })

  it('can reopen modal after closing', async () => {
    const user = userEvent.setup()
    render(<ModalDialog title="Hello" body="World" />)
    await user.click(screen.getByTestId('open-modal'))
    await user.click(screen.getByTestId('close-modal'))
    await user.click(screen.getByTestId('open-modal'))
    expect(screen.getByTestId('modal-dialog')).toBeDefined()
  })
})

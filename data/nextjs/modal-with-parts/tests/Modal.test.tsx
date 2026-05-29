import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../components/Modal'

describe('Modal with parts', () => {
  it('renders nothing when closed', () => {
    render(
      <Modal open={false} title="Confirm" onClose={() => {}} onConfirm={() => {}}>
        <p>body</p>
      </Modal>
    )
    expect(screen.queryByTestId('modal')).toBeNull()
  })

  it('renders header, body, footer when open', () => {
    render(
      <Modal open={true} title="Confirm" onClose={() => {}} onConfirm={() => {}}>
        <p>are you sure?</p>
      </Modal>
    )
    expect(screen.getByTestId('modal')).toBeInTheDocument()
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Confirm')
    expect(screen.getByTestId('modal-body')).toHaveTextContent('are you sure?')
    expect(screen.getByTestId('modal-confirm')).toHaveTextContent('OK')
    expect(screen.getByTestId('modal-cancel')).toHaveTextContent('Cancel')
  })

  it('confirm and close buttons call their handlers', async () => {
    const onConfirm = vi.fn()
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <Modal open={true} title="X" onClose={onClose} onConfirm={onConfirm}>
        <p>x</p>
      </Modal>
    )
    await user.click(screen.getByTestId('modal-confirm'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    await user.click(screen.getByTestId('modal-close'))
    expect(onClose).toHaveBeenCalledTimes(1)
    await user.click(screen.getByTestId('modal-cancel'))
    expect(onClose).toHaveBeenCalledTimes(2)
  })
})

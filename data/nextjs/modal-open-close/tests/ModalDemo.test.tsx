import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModalDemo from '../components/ModalDemo'

describe('ModalDemo', () => {
  it('modal is absent initially', () => {
    render(<ModalDemo />)
    expect(screen.queryByTestId('modal')).toBeNull()
    expect(screen.getByTestId('open')).toBeInTheDocument()
  })

  it('opens the modal on click', async () => {
    const user = userEvent.setup()
    render(<ModalDemo />)
    await user.click(screen.getByTestId('open'))
    expect(screen.getByTestId('modal')).toHaveTextContent('This is a modal')
    expect(screen.getByTestId('close')).toHaveTextContent('Close')
  })

  it('closes the modal on Close', async () => {
    const user = userEvent.setup()
    render(<ModalDemo />)
    await user.click(screen.getByTestId('open'))
    await user.click(screen.getByTestId('close'))
    expect(screen.queryByTestId('modal')).toBeNull()
    expect(screen.getByTestId('open')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ToggleBlock from '../components/ToggleBlock'

describe('ToggleBlock', () => {
  it('starts hidden: block absent, button says Show', () => {
    render(<ToggleBlock text="hello" />)
    expect(screen.queryByTestId('block')).toBeNull()
    expect(screen.getByRole('button')).toHaveTextContent('Show')
  })

  it('reveals the block on click and updates button label', async () => {
    const user = userEvent.setup()
    render(<ToggleBlock text="hello" />)
    await user.click(screen.getByRole('button'))
    expect(screen.getByTestId('block')).toHaveTextContent('hello')
    expect(screen.getByRole('button')).toHaveTextContent('Hide')
  })

  it('hides the block on second click', async () => {
    const user = userEvent.setup()
    render(<ToggleBlock text="hello" />)
    const btn = screen.getByRole('button')
    await user.click(btn)
    await user.click(btn)
    expect(screen.queryByTestId('block')).toBeNull()
    expect(btn).toHaveTextContent('Show')
  })
})

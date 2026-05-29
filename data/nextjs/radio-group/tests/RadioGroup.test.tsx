import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RadioGroup from '../components/RadioGroup'

describe('RadioGroup', () => {
  it('starts with nothing selected', () => {
    render(<RadioGroup options={['a', 'b', 'c']} />)
    expect(screen.getByTestId('selected')).toHaveTextContent('none')
  })

  it('reflects the selected option', async () => {
    const user = userEvent.setup()
    render(<RadioGroup options={['a', 'b', 'c']} />)
    await user.click(screen.getByTestId('r-b'))
    expect(screen.getByTestId('selected')).toHaveTextContent('b')
    expect(screen.getByTestId('r-b')).toBeChecked()
    expect(screen.getByTestId('r-a')).not.toBeChecked()
  })

  it('switching options updates the display and unchecks the prior', async () => {
    const user = userEvent.setup()
    render(<RadioGroup options={['a', 'b', 'c']} />)
    await user.click(screen.getByTestId('r-a'))
    await user.click(screen.getByTestId('r-c'))
    expect(screen.getByTestId('selected')).toHaveTextContent('c')
    expect(screen.getByTestId('r-a')).not.toBeChecked()
    expect(screen.getByTestId('r-c')).toBeChecked()
  })
})

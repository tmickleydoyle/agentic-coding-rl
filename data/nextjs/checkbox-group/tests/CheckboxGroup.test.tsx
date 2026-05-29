import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CheckboxGroup from '../components/CheckboxGroup'

describe('CheckboxGroup', () => {
  it('starts with 0 checked', () => {
    render(<CheckboxGroup options={['red', 'green', 'blue']} />)
    expect(screen.getByTestId('count')).toHaveTextContent('0')
    for (const o of ['red', 'green', 'blue']) {
      expect(screen.getByTestId(`cb-${o}`)).not.toBeChecked()
    }
  })

  it('increments count as boxes are checked', async () => {
    const user = userEvent.setup()
    render(<CheckboxGroup options={['red', 'green', 'blue']} />)
    await user.click(screen.getByTestId('cb-red'))
    expect(screen.getByTestId('count')).toHaveTextContent('1')
    await user.click(screen.getByTestId('cb-blue'))
    expect(screen.getByTestId('count')).toHaveTextContent('2')
  })

  it('decrements count when a box is unchecked', async () => {
    const user = userEvent.setup()
    render(<CheckboxGroup options={['red', 'green', 'blue']} />)
    await user.click(screen.getByTestId('cb-red'))
    await user.click(screen.getByTestId('cb-green'))
    await user.click(screen.getByTestId('cb-red'))
    expect(screen.getByTestId('count')).toHaveTextContent('1')
    expect(screen.getByTestId('cb-red')).not.toBeChecked()
    expect(screen.getByTestId('cb-green')).toBeChecked()
  })
})

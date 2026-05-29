import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Wizard from '../components/Wizard'

describe('Stepper form', () => {
  it('starts on step 1 with name input and disabled Back/Next', () => {
    render(<Wizard />)
    expect(screen.getByTestId('step')).toHaveTextContent('1')
    expect(screen.getByTestId('name')).toBeInTheDocument()
    expect(screen.getByTestId('back')).toBeDisabled()
    expect(screen.getByTestId('next')).toBeDisabled()
  })

  it('Next enables once the name is non-empty', async () => {
    const user = userEvent.setup()
    render(<Wizard />)
    await user.type(screen.getByTestId('name'), 'Ada')
    expect(screen.getByTestId('next')).not.toBeDisabled()
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('step')).toHaveTextContent('2')
    expect(screen.getByTestId('email')).toBeInTheDocument()
  })

  it('step 2 Next is gated on a valid email', async () => {
    const user = userEvent.setup()
    render(<Wizard />)
    await user.type(screen.getByTestId('name'), 'Ada')
    await user.click(screen.getByTestId('next'))
    await user.type(screen.getByTestId('email'), 'bad')
    expect(screen.getByTestId('next')).toBeDisabled()
    await user.type(screen.getByTestId('email'), '@x.io')
    expect(screen.getByTestId('next')).not.toBeDisabled()
  })

  it('Back preserves previously entered values', async () => {
    const user = userEvent.setup()
    render(<Wizard />)
    await user.type(screen.getByTestId('name'), 'Ada')
    await user.click(screen.getByTestId('next'))
    await user.type(screen.getByTestId('email'), 'ada@x.io')
    await user.click(screen.getByTestId('back'))
    expect((screen.getByTestId('name') as HTMLInputElement).value).toBe('Ada')
    await user.click(screen.getByTestId('next'))
    expect((screen.getByTestId('email') as HTMLInputElement).value).toBe('ada@x.io')
  })

  it('step 3 Submit is gated on a positive integer age', async () => {
    const user = userEvent.setup()
    render(<Wizard />)
    await user.type(screen.getByTestId('name'), 'Ada')
    await user.click(screen.getByTestId('next'))
    await user.type(screen.getByTestId('email'), 'ada@x.io')
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('step')).toHaveTextContent('3')
    expect(screen.getByTestId('submit')).toBeDisabled()
    await user.type(screen.getByTestId('age'), 'abc')
    expect(screen.getByTestId('submit')).toBeDisabled()
    await user.clear(screen.getByTestId('age'))
    await user.type(screen.getByTestId('age'), '0')
    expect(screen.getByTestId('submit')).toBeDisabled()
    await user.clear(screen.getByTestId('age'))
    await user.type(screen.getByTestId('age'), '36')
    expect(screen.getByTestId('submit')).not.toBeDisabled()
  })

  it('Submit shows a summary of all entered values and hides nav', async () => {
    const user = userEvent.setup()
    render(<Wizard />)
    await user.type(screen.getByTestId('name'), 'Ada')
    await user.click(screen.getByTestId('next'))
    await user.type(screen.getByTestId('email'), 'ada@x.io')
    await user.click(screen.getByTestId('next'))
    await user.type(screen.getByTestId('age'), '36')
    await user.click(screen.getByTestId('submit'))
    const summary = screen.getByTestId('summary')
    expect(summary).toHaveTextContent('Ada')
    expect(summary).toHaveTextContent('ada@x.io')
    expect(summary).toHaveTextContent('36')
    expect(screen.queryByTestId('next')).toBeNull()
    expect(screen.queryByTestId('submit')).toBeNull()
    expect(screen.queryByTestId('age')).toBeNull()
  })

  it('only one step input is visible at a time', async () => {
    const user = userEvent.setup()
    render(<Wizard />)
    expect(screen.queryByTestId('email')).toBeNull()
    expect(screen.queryByTestId('age')).toBeNull()
    await user.type(screen.getByTestId('name'), 'Ada')
    await user.click(screen.getByTestId('next'))
    expect(screen.queryByTestId('name')).toBeNull()
    expect(screen.queryByTestId('age')).toBeNull()
  })
})

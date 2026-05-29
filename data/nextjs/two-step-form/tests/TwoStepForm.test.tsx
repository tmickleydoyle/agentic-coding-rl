import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TwoStepForm from '../components/TwoStepForm'

describe('TwoStepForm', () => {
  it('starts on step 1', () => {
    render(<TwoStepForm />)
    expect(screen.getByTestId('step')).toHaveTextContent('1')
    expect(screen.getByTestId('name')).toBeInTheDocument()
    expect(screen.queryByTestId('email')).toBeNull()
  })

  it('does not advance to step 2 with empty/whitespace name', async () => {
    const user = userEvent.setup()
    render(<TwoStepForm />)
    await user.type(screen.getByTestId('name'), '   ')
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('step')).toHaveTextContent('1')
    expect(screen.queryByTestId('email')).toBeNull()
  })

  it('advances to step 2 with a valid name', async () => {
    const user = userEvent.setup()
    render(<TwoStepForm />)
    await user.type(screen.getByTestId('name'), 'Ada')
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('step')).toHaveTextContent('2')
    expect(screen.getByTestId('email')).toBeInTheDocument()
    expect(screen.getByTestId('submit')).toBeDisabled()
  })

  it('Back returns to step 1 with the name preserved', async () => {
    const user = userEvent.setup()
    render(<TwoStepForm />)
    await user.type(screen.getByTestId('name'), 'Ada')
    await user.click(screen.getByTestId('next'))
    await user.click(screen.getByTestId('back'))
    expect(screen.getByTestId('step')).toHaveTextContent('1')
    expect((screen.getByTestId('name') as HTMLInputElement).value).toBe('Ada')
  })

  it('Submit enables once email is non-empty; submitting shows status only', async () => {
    const user = userEvent.setup()
    render(<TwoStepForm />)
    await user.type(screen.getByTestId('name'), 'Ada')
    await user.click(screen.getByTestId('next'))
    await user.type(screen.getByTestId('email'), 'ada@example.com')
    expect(screen.getByTestId('submit')).not.toBeDisabled()
    await user.click(screen.getByTestId('submit'))
    expect(screen.getByTestId('status')).toHaveTextContent('Submitted: Ada / ada@example.com')
    expect(screen.queryByTestId('name')).toBeNull()
    expect(screen.queryByTestId('email')).toBeNull()
  })
})

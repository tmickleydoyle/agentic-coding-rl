import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ResetForm from '../components/ResetForm'

describe('ResetForm', () => {
  it('has no errors before submit', () => {
    render(<ResetForm />)
    expect(screen.queryByTestId('name-error')).toBeNull()
    expect(screen.queryByTestId('age-error')).toBeNull()
  })

  it('shows both errors on an invalid submit', async () => {
    const user = userEvent.setup()
    render(<ResetForm />)
    await user.click(screen.getByTestId('submit'))
    expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required.')
    expect(screen.getByTestId('age-error')).toHaveTextContent('Must be 18 or older.')
  })

  it('reset clears the input values', async () => {
    const user = userEvent.setup()
    render(<ResetForm />)
    await user.type(screen.getByTestId('name'), 'Ada')
    await user.type(screen.getByTestId('age'), '42')
    await user.click(screen.getByTestId('reset'))
    expect(screen.getByTestId('name')).toHaveValue('')
    expect(screen.getByTestId('age')).toHaveValue('')
  })

  it('reset also clears existing error messages', async () => {
    const user = userEvent.setup()
    render(<ResetForm />)
    await user.click(screen.getByTestId('submit'))
    expect(screen.getByTestId('name-error')).toBeInTheDocument()
    await user.click(screen.getByTestId('reset'))
    expect(screen.queryByTestId('name-error')).toBeNull()
    expect(screen.queryByTestId('age-error')).toBeNull()
  })

  it('a valid submit produces no errors', async () => {
    const user = userEvent.setup()
    render(<ResetForm />)
    await user.type(screen.getByTestId('name'), 'Ada')
    await user.type(screen.getByTestId('age'), '18')
    await user.click(screen.getByTestId('submit'))
    expect(screen.queryByTestId('name-error')).toBeNull()
    expect(screen.queryByTestId('age-error')).toBeNull()
  })
})

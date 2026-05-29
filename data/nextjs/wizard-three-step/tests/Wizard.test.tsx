import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Wizard from '../components/Wizard'

describe('Wizard', () => {
  it('starts on step 1; back disabled; next disabled when empty', () => {
    render(<Wizard />)
    expect(screen.getByTestId('step')).toHaveTextContent('1')
    expect(screen.getByTestId('back')).toBeDisabled()
    expect(screen.getByTestId('next')).toBeDisabled()
  })

  it('advances through all 3 steps', async () => {
    const user = userEvent.setup()
    render(<Wizard />)
    await user.type(screen.getByTestId('name'), 'Ada')
    expect(screen.getByTestId('next')).not.toBeDisabled()
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('step')).toHaveTextContent('2')
    await user.type(screen.getByTestId('email'), 'a@b.co')
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('step')).toHaveTextContent('3')
    expect(screen.getByTestId('summary')).toHaveTextContent('Ada · a@b.co')
  })

  it('back from step 3 preserves both fields', async () => {
    const user = userEvent.setup()
    render(<Wizard />)
    await user.type(screen.getByTestId('name'), 'Ada')
    await user.click(screen.getByTestId('next'))
    await user.type(screen.getByTestId('email'), 'a@b.co')
    await user.click(screen.getByTestId('next'))
    await user.click(screen.getByTestId('back'))
    expect(screen.getByTestId('step')).toHaveTextContent('2')
    expect((screen.getByTestId('email') as HTMLInputElement).value).toBe('a@b.co')
    await user.click(screen.getByTestId('back'))
    expect(screen.getByTestId('step')).toHaveTextContent('1')
    expect((screen.getByTestId('name') as HTMLInputElement).value).toBe('Ada')
  })

  it('Submit shows only status=Done', async () => {
    const user = userEvent.setup()
    render(<Wizard />)
    await user.type(screen.getByTestId('name'), 'Ada')
    await user.click(screen.getByTestId('next'))
    await user.type(screen.getByTestId('email'), 'a@b.co')
    await user.click(screen.getByTestId('next'))
    await user.click(screen.getByTestId('submit'))
    expect(screen.getByTestId('status')).toHaveTextContent('Done')
    expect(screen.queryByTestId('summary')).toBeNull()
    expect(screen.queryByTestId('name')).toBeNull()
    expect(screen.queryByTestId('email')).toBeNull()
  })
})

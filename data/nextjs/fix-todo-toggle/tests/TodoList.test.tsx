import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoList from '../components/TodoList'

describe('TodoList', () => {
  it('starts with nothing done', () => {
    render(<TodoList />)
    expect(screen.getByTestId('label-1')).not.toHaveClass('done')
    expect(screen.getByTestId('label-2')).not.toHaveClass('done')
    expect(screen.getByTestId('label-3')).not.toHaveClass('done')
  })

  it('toggling item 1 only marks item 1 done', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await user.click(screen.getByTestId('toggle-1'))
    expect(screen.getByTestId('label-1')).toHaveClass('done')
    expect(screen.getByTestId('label-2')).not.toHaveClass('done')
    expect(screen.getByTestId('label-3')).not.toHaveClass('done')
  })

  it('toggling item 2 leaves items 1 and 3 untouched', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await user.click(screen.getByTestId('toggle-2'))
    expect(screen.getByTestId('label-1')).not.toHaveClass('done')
    expect(screen.getByTestId('label-2')).toHaveClass('done')
    expect(screen.getByTestId('label-3')).not.toHaveClass('done')
  })

  it('reflects checkbox checked state per item', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await user.click(screen.getByTestId('toggle-3'))
    expect(screen.getByTestId('toggle-1')).not.toBeChecked()
    expect(screen.getByTestId('toggle-3')).toBeChecked()
  })

  it('unchecking one item does not affect others', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    await user.click(screen.getByTestId('toggle-1'))
    await user.click(screen.getByTestId('toggle-2'))
    await user.click(screen.getByTestId('toggle-1'))
    expect(screen.getByTestId('label-1')).not.toHaveClass('done')
    expect(screen.getByTestId('label-2')).toHaveClass('done')
  })
})

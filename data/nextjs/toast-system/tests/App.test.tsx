import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../components/App'

describe('Toast system', () => {
  it('starts with no toasts', () => {
    render(<App />)
    expect(within(screen.getByTestId('toasts')).queryAllByRole('listitem')).toHaveLength(0)
  })

  it('show-hi adds a toast with text "hi"', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('show-hi'))
    const items = within(screen.getByTestId('toasts')).getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent('hi')
  })

  it('multiple shows stack up', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('show-hi'))
    await user.click(screen.getByTestId('show-bye'))
    await user.click(screen.getByTestId('show-hi'))
    const items = within(screen.getByTestId('toasts')).getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(items[0]).toHaveTextContent('hi')
    expect(items[1]).toHaveTextContent('bye')
    expect(items[2]).toHaveTextContent('hi')
  })

  it('dismiss removes only the specific toast', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('show-hi'))
    await user.click(screen.getByTestId('show-bye'))
    const before = within(screen.getByTestId('toasts')).getAllByRole('listitem')
    // dismiss the first
    const firstId = before[0].getAttribute('data-testid')!.replace('toast-', '')
    await user.click(screen.getByTestId(`dismiss-${firstId}`))
    const after = within(screen.getByTestId('toasts')).getAllByRole('listitem')
    expect(after).toHaveLength(1)
    expect(after[0]).toHaveTextContent('bye')
  })
})

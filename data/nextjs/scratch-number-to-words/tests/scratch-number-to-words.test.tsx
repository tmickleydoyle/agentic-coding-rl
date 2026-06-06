import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function convert(user: ReturnType<typeof userEvent.setup>, value: string) {
  const input = screen.getByLabelText('Enter a number')
  await user.clear(input)
  await user.type(input, value)
  await user.click(screen.getByRole('button', { name: /convert/i }))
}

describe('Number to Words', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('shows empty result and error initially', () => {
    expect(screen.getByTestId('result')).toHaveTextContent('')
    expect(screen.getByTestId('error')).toHaveTextContent('')
  })

  it('converts 0 to zero', async () => {
    const user = userEvent.setup()
    await convert(user, '0')
    expect(screen.getByTestId('result')).toHaveTextContent('zero')
  })

  it('converts 15 to fifteen', async () => {
    const user = userEvent.setup()
    await convert(user, '15')
    expect(screen.getByTestId('result')).toHaveTextContent('fifteen')
  })

  it('converts 42 to forty-two', async () => {
    const user = userEvent.setup()
    await convert(user, '42')
    expect(screen.getByTestId('result')).toHaveTextContent('forty-two')
  })

  it('converts 100 to one hundred', async () => {
    const user = userEvent.setup()
    await convert(user, '100')
    expect(screen.getByTestId('result')).toHaveTextContent('one hundred')
  })

  it('converts 215 to two hundred fifteen', async () => {
    const user = userEvent.setup()
    await convert(user, '215')
    expect(screen.getByTestId('result')).toHaveTextContent('two hundred fifteen')
  })

  it('converts 1000 to one thousand', async () => {
    const user = userEvent.setup()
    await convert(user, '1000')
    expect(screen.getByTestId('result')).toHaveTextContent('one thousand')
  })

  it('converts 12345 to twelve thousand three hundred forty-five', async () => {
    const user = userEvent.setup()
    await convert(user, '12345')
    expect(screen.getByTestId('result')).toHaveTextContent('twelve thousand three hundred forty-five')
  })

  it('converts negative numbers', async () => {
    const user = userEvent.setup()
    await convert(user, '-5')
    expect(screen.getByTestId('result')).toHaveTextContent('negative five')
  })

  it('converts -100 to negative one hundred', async () => {
    const user = userEvent.setup()
    await convert(user, '-100')
    expect(screen.getByTestId('result')).toHaveTextContent('negative one hundred')
  })

  it('shows error for empty input', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getByTestId('error')).toHaveTextContent('Please enter a number')
  })

  it('clears error on valid conversion', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /convert/i }))
    expect(screen.getByTestId('error')).toHaveTextContent('Please enter a number')
    await convert(user, '5')
    expect(screen.getByTestId('error')).toHaveTextContent('')
  })

  it('converts 999999 correctly', async () => {
    const user = userEvent.setup()
    await convert(user, '999999')
    expect(screen.getByTestId('result')).toHaveTextContent('nine hundred ninety-nine thousand nine hundred ninety-nine')
  })
})

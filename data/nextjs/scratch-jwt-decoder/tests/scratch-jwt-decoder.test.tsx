import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

// JWT with exp claim (exp: 9999999999 = far future)
const JWT_WITH_EXP = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjo5OTk5OTk5OTk5fQ.signature'

describe('JWT Decoder', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /jwt decoder/i })).toBeInTheDocument()
  })

  it('shows Invalid by default', () => {
    expect(screen.getByTestId('token-valid')).toHaveTextContent('Invalid')
  })

  it('shows - for alg by default', () => {
    expect(screen.getByTestId('token-alg')).toHaveTextContent('-')
  })

  it('shows No expiry by default', () => {
    expect(screen.getByTestId('token-exp')).toHaveTextContent('No expiry')
  })

  it('shows No iat by default', () => {
    expect(screen.getByTestId('token-iat')).toHaveTextContent('No iat')
  })

  it('decodes a valid JWT', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/jwt token/i), SAMPLE_JWT)
    await user.click(screen.getByRole('button', { name: /^decode$/i }))
    expect(screen.getByTestId('token-valid')).toHaveTextContent('Valid')
  })

  it('shows algorithm after decode', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/jwt token/i), SAMPLE_JWT)
    await user.click(screen.getByRole('button', { name: /^decode$/i }))
    expect(screen.getByTestId('token-alg')).toHaveTextContent('HS256')
  })

  it('shows header JSON after decode', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/jwt token/i), SAMPLE_JWT)
    await user.click(screen.getByRole('button', { name: /^decode$/i }))
    expect(screen.getByTestId('header-output')).toHaveTextContent('"alg"')
    expect(screen.getByTestId('header-output')).toHaveTextContent('"HS256"')
  })

  it('shows payload JSON after decode', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/jwt token/i), SAMPLE_JWT)
    await user.click(screen.getByRole('button', { name: /^decode$/i }))
    expect(screen.getByTestId('payload-output')).toHaveTextContent('"John Doe"')
    expect(screen.getByTestId('payload-output')).toHaveTextContent('"sub"')
  })

  it('shows signature after decode', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/jwt token/i), SAMPLE_JWT)
    await user.click(screen.getByRole('button', { name: /^decode$/i }))
    expect(screen.getByTestId('signature-output')).toHaveTextContent('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
  })

  it('shows No expiry when no exp claim', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/jwt token/i), SAMPLE_JWT)
    await user.click(screen.getByRole('button', { name: /^decode$/i }))
    expect(screen.getByTestId('token-exp')).toHaveTextContent('No expiry')
  })

  it('shows iat as date when iat claim exists', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/jwt token/i), SAMPLE_JWT)
    await user.click(screen.getByRole('button', { name: /^decode$/i }))
    // iat = 1516239022; should not show "No iat"
    expect(screen.getByTestId('token-iat')).not.toHaveTextContent('No iat')
  })

  it('shows Invalid for malformed input', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/jwt token/i), 'notajwt')
    await user.click(screen.getByRole('button', { name: /^decode$/i }))
    expect(screen.getByTestId('token-valid')).toHaveTextContent('Invalid')
  })

  it('clears all state on Clear button click', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/jwt token/i), SAMPLE_JWT)
    await user.click(screen.getByRole('button', { name: /^decode$/i }))
    await user.click(screen.getByRole('button', { name: /clear/i }))
    expect(screen.getByTestId('token-valid')).toHaveTextContent('Invalid')
    expect(screen.getByTestId('token-alg')).toHaveTextContent('-')
    expect(screen.getByTestId('header-output')).toHaveTextContent('')
  })

  it('adds decoded token to history', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/jwt token/i), SAMPLE_JWT)
    await user.click(screen.getByRole('button', { name: /^decode$/i }))
    expect(screen.getAllByTestId('history-item')).toHaveLength(1)
  })

  it('history does not exceed 3 items', async () => {
    const user = userEvent.setup()
    const tokens = [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhIjoxfQ.sig1',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiIjoyfQ.sig2',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjIjozfQ.sig3',
      SAMPLE_JWT,
    ]
    const input = screen.getByLabelText(/jwt token/i)
    for (const token of tokens) {
      await user.clear(input)
      await user.type(input, token)
      await user.click(screen.getByRole('button', { name: /^decode$/i }))
    }
    expect(screen.getAllByTestId('history-item')).toHaveLength(3)
  })
})

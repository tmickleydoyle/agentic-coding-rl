import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('URL Parser', () => {
  it('renders heading and input', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /url parser/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/url/i)).toBeInTheDocument()
  })

  it('seeds input with a default URL', () => {
    render(<App />)
    const input = screen.getByLabelText(/url/i) as HTMLInputElement
    expect(input.value).toContain('example.com')
  })

  it('parses the seed URL and shows results', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /parse/i }))
    expect(screen.getByTestId('results')).toBeInTheDocument()
    expect(screen.getByTestId('parsed-protocol').textContent).toBe('https:')
    expect(screen.getByTestId('parsed-hostname').textContent).toBe('example.com')
    expect(screen.getByTestId('parsed-port').textContent).toBe('8080')
  })

  it('shows username and password', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /parse/i }))
    expect(screen.getByTestId('parsed-username').textContent).toBe('user')
    expect(screen.getByTestId('parsed-password').textContent).toBe('pass')
  })

  it('shows pathname, search and hash', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /parse/i }))
    expect(screen.getByTestId('parsed-pathname').textContent).toBe('/path/to/page')
    expect(screen.getByTestId('parsed-search').textContent).toBe('?foo=bar&baz=qux')
    expect(screen.getByTestId('parsed-hash').textContent).toBe('#section2')
  })

  it('shows query parameter rows', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /parse/i }))
    const rows = screen.getAllByTestId('param-row')
    expect(rows).toHaveLength(2)
    expect(rows[0].textContent).toBe('foo=bar')
    expect(rows[1].textContent).toBe('baz=qux')
  })

  it('shows error for invalid URL', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/url/i))
    await user.type(screen.getByLabelText(/url/i), 'not-a-valid-url')
    await user.click(screen.getByRole('button', { name: /parse/i }))
    expect(screen.getByTestId('parse-error')).toBeInTheDocument()
    expect(screen.queryByTestId('parsed-hostname')).not.toBeInTheDocument()
  })

  it('does not show results before parsing', () => {
    render(<App />)
    expect(screen.queryByTestId('results')).not.toBeInTheDocument()
  })

  it('clear button resets input and hides results', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /parse/i }))
    expect(screen.getByTestId('results')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /clear/i }))
    expect(screen.queryByTestId('results')).not.toBeInTheDocument()
    const input = screen.getByLabelText(/url/i) as HTMLInputElement
    expect(input.value).toBe('')
  })

  it('re-parses when URL is changed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/url/i))
    await user.type(screen.getByLabelText(/url/i), 'http://other.org/foo')
    await user.click(screen.getByRole('button', { name: /parse/i }))
    expect(screen.getByTestId('parsed-hostname').textContent).toBe('other.org')
    expect(screen.getByTestId('parsed-protocol').textContent).toBe('http:')
  })

  it('URL with no query params shows empty param list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/url/i))
    await user.type(screen.getByLabelText(/url/i), 'https://simple.com/path')
    await user.click(screen.getByRole('button', { name: /parse/i }))
    expect(screen.queryAllByTestId('param-row')).toHaveLength(0)
  })

  it('clear after error also hides error', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/url/i))
    await user.type(screen.getByLabelText(/url/i), 'bad')
    await user.click(screen.getByRole('button', { name: /parse/i }))
    expect(screen.getByTestId('parse-error')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /clear/i }))
    expect(screen.queryByTestId('parse-error')).not.toBeInTheDocument()
  })
})

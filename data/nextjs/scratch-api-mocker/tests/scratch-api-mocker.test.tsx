import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('API Mocker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('shows initial route count of 3', () => {
    expect(screen.getByTestId('route-count')).toHaveTextContent('Routes: 3')
  })

  it('shows 3 seed route rows', () => {
    expect(screen.getAllByTestId('route-row')).toHaveLength(3)
  })

  it('shows empty response status and body initially', () => {
    expect(screen.getByTestId('response-status')).toHaveTextContent('')
    expect(screen.getByTestId('response-body')).toHaveTextContent('')
  })

  it('adds a new route', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Path'), '/api/test')
    await user.type(screen.getByLabelText('Status code'), '200')
    await user.type(screen.getByLabelText('Response body'), '{"ok":true}')
    await user.click(screen.getByRole('button', { name: /add route/i }))
    expect(screen.getAllByTestId('route-row')).toHaveLength(4)
    expect(screen.getByTestId('route-count')).toHaveTextContent('Routes: 4')
  })

  it('does not add route with empty path', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Status code'), '200')
    await user.click(screen.getByRole('button', { name: /add route/i }))
    expect(screen.getAllByTestId('route-row')).toHaveLength(3)
  })

  it('clears path/status/body inputs after adding', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Path'), '/api/test')
    await user.type(screen.getByLabelText('Status code'), '200')
    await user.type(screen.getByLabelText('Response body'), 'ok')
    await user.click(screen.getByRole('button', { name: /add route/i }))
    expect(screen.getByLabelText('Path')).toHaveValue('')
    expect(screen.getByLabelText('Status code')).toHaveValue(null)
  })

  it('deletes a route', async () => {
    const user = userEvent.setup()
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    expect(screen.getAllByTestId('route-row')).toHaveLength(2)
    expect(screen.getByTestId('route-count')).toHaveTextContent('Routes: 2')
  })

  it('sends a request and gets matching response', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Request path'), '/api/users')
    await user.click(screen.getByRole('button', { name: /send request/i }))
    expect(screen.getByTestId('response-status')).toHaveTextContent('Status: 200')
    expect(screen.getByTestId('response-body')).toHaveTextContent('{"users": []}')
  })

  it('returns 404 for unmatched route', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Request path'), '/api/unknown')
    await user.click(screen.getByRole('button', { name: /send request/i }))
    expect(screen.getByTestId('response-status')).toHaveTextContent('Status: 404')
    expect(screen.getByTestId('response-body')).toHaveTextContent('{"error": "Not found"}')
  })

  it('method must match for route lookup', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText('Request method'), 'DELETE')
    await user.type(screen.getByLabelText('Request path'), '/api/users')
    await user.click(screen.getByRole('button', { name: /send request/i }))
    expect(screen.getByTestId('response-status')).toHaveTextContent('Status: 404')
  })

  it('POST /api/users returns 201', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText('Request method'), 'POST')
    await user.type(screen.getByLabelText('Request path'), '/api/users')
    await user.click(screen.getByRole('button', { name: /send request/i }))
    expect(screen.getByTestId('response-status')).toHaveTextContent('Status: 201')
    expect(screen.getByTestId('response-body')).toHaveTextContent('{"created": true}')
  })

  it('newly added route is matchable', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText('Method'), 'PUT')
    await user.type(screen.getByLabelText('Path'), '/api/item')
    await user.type(screen.getByLabelText('Status code'), '200')
    await user.type(screen.getByLabelText('Response body'), '{"updated":true}')
    await user.click(screen.getByRole('button', { name: /add route/i }))
    await user.selectOptions(screen.getByLabelText('Request method'), 'PUT')
    await user.type(screen.getByLabelText('Request path'), '/api/item')
    await user.click(screen.getByRole('button', { name: /send request/i }))
    expect(screen.getByTestId('response-status')).toHaveTextContent('Status: 200')
  })
})

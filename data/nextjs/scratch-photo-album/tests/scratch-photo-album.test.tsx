import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Photo Album', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /photo album/i })).toBeTruthy()
  })

  it('renders 3 seed photos on load', () => {
    const cards = screen.getAllByTestId('photo-card')
    expect(cards).toHaveLength(3)
  })

  it('shows photo count of 3 on load', () => {
    expect(screen.getByTestId('photo-count').textContent).toContain('3')
  })

  it('renders seed photo titles', () => {
    expect(screen.getByText('Beach Sunset')).toBeTruthy()
    expect(screen.getByText('Mountain Hike')).toBeTruthy()
    expect(screen.getByText('City Lights')).toBeTruthy()
  })

  it('adds a new photo when form is submitted with valid data', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Forest Path')
    await user.type(screen.getByTestId('input-url'), 'https://example.com/forest.jpg')
    await user.type(screen.getByTestId('input-description'), 'Misty morning trail')
    fireEvent.change(screen.getByTestId('input-date'), { target: { value: '2024-12-01' } })
    await user.click(screen.getByTestId('add-btn'))
    const cards = screen.getAllByTestId('photo-card')
    expect(cards).toHaveLength(4)
    expect(screen.getByText('Forest Path')).toBeTruthy()
  })

  it('clears form after successful submission', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Forest Path')
    await user.type(screen.getByTestId('input-url'), 'https://example.com/forest.jpg')
    await user.click(screen.getByTestId('add-btn'))
    expect((screen.getByTestId('input-title') as HTMLInputElement).value).toBe('')
    expect((screen.getByTestId('input-url') as HTMLInputElement).value).toBe('')
  })

  it('shows validation error when title is empty', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-url'), 'https://example.com/img.jpg')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('form-error').textContent).toContain('Title and URL are required')
  })

  it('shows validation error when url is empty', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Test Photo')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('form-error')).toBeTruthy()
  })

  it('does not add photo on validation failure', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getAllByTestId('photo-card')).toHaveLength(3)
  })

  it('retains form values after failed validation', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Partial Entry')
    await user.click(screen.getByTestId('add-btn'))
    expect((screen.getByTestId('input-title') as HTMLInputElement).value).toBe('Partial Entry')
  })

  it('deletes a photo when delete button is clicked', async () => {
    const user = userEvent.setup()
    const deleteButtons = screen.getAllByTestId('delete-btn')
    await user.click(deleteButtons[0])
    expect(screen.getAllByTestId('photo-card')).toHaveLength(2)
  })

  it('updates photo count after deletion', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByTestId('delete-btn')[0])
    expect(screen.getByTestId('photo-count').textContent).toContain('2')
  })

  it('shows empty state when all photos are deleted', async () => {
    const user = userEvent.setup()
    const deleteButtons = screen.getAllByTestId('delete-btn')
    await user.click(deleteButtons[0])
    await user.click(screen.getAllByTestId('delete-btn')[0])
    await user.click(screen.getAllByTestId('delete-btn')[0])
    expect(screen.getByTestId('empty-state')).toBeTruthy()
  })

  it('clears error after successful submission', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('form-error')).toBeTruthy()
    await user.type(screen.getByTestId('input-title'), 'Valid Title')
    await user.type(screen.getByTestId('input-url'), 'https://example.com/img.jpg')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.queryByTestId('form-error')).toBeNull()
  })
})

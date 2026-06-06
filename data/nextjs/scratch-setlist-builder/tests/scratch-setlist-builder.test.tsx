import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Setlist Builder', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByText('Setlist Builder')).toBeTruthy()
  })

  it('shows 5 seed songs', () => {
    expect(screen.getByTestId('song-count').textContent).toBe('5')
  })

  it('shows seed song items', () => {
    expect(screen.getByTestId('song-item-1')).toBeTruthy()
    expect(screen.getByTestId('song-item-5')).toBeTruthy()
  })

  it('displays formatted duration for a song', () => {
    // 354s = 5:54
    expect(within(screen.getByTestId('song-item-1')).getByTestId('song-duration-1').textContent).toBe('5:54')
  })

  it('displays correct total duration', () => {
    // 354+391+482+356+301 = 1884s = 31m 24s
    expect(screen.getByTestId('total-duration').textContent).toBe('31m 24s')
  })

  it('first song move-up button is disabled', () => {
    const btn = screen.getByTestId('move-up-1')
    expect((btn as HTMLButtonElement).disabled).toBe(true)
  })

  it('last song move-down button is disabled', () => {
    const btn = screen.getByTestId('move-down-5')
    expect((btn as HTMLButtonElement).disabled).toBe(true)
  })

  it('moves a song up', async () => {
    const user = userEvent.setup()
    // Song 2 is at position 2, move up to position 1
    await user.click(screen.getByTestId('move-up-2'))
    expect(within(screen.getByTestId('song-item-2')).getByTestId('song-position-2').textContent).toBe('1')
    expect(within(screen.getByTestId('song-item-1')).getByTestId('song-position-1').textContent).toBe('2')
  })

  it('moves a song down', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('move-down-1'))
    expect(within(screen.getByTestId('song-item-1')).getByTestId('song-position-1').textContent).toBe('2')
  })

  it('removes a song', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('remove-btn-3'))
    expect(screen.queryByTestId('song-item-3')).toBeNull()
    expect(screen.getByTestId('song-count').textContent).toBe('4')
  })

  it('adds a new song', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Yesterday')
    await user.type(screen.getByTestId('input-artist'), 'Beatles')
    await user.type(screen.getByTestId('input-duration'), '125')
    await user.click(screen.getByTestId('btn-add'))
    expect(screen.getByTestId('song-count').textContent).toBe('6')
  })

  it('does not add song with empty title', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-duration'), '120')
    await user.click(screen.getByTestId('btn-add'))
    expect(screen.getByTestId('song-count').textContent).toBe('5')
  })

  it('does not add song with zero duration', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'No Duration')
    await user.click(screen.getByTestId('btn-add'))
    expect(screen.getByTestId('song-count').textContent).toBe('5')
  })

  it('total duration updates after add', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Short Track')
    await user.type(screen.getByTestId('input-duration'), '60')
    await user.click(screen.getByTestId('btn-add'))
    // 1884+60 = 1944s = 32m 24s
    expect(screen.getByTestId('total-duration').textContent).toBe('32m 24s')
  })

  it('empty setlist shows 0m 0s', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('remove-btn-1'))
    await user.click(screen.getByTestId('remove-btn-2'))
    await user.click(screen.getByTestId('remove-btn-3'))
    await user.click(screen.getByTestId('remove-btn-4'))
    await user.click(screen.getByTestId('remove-btn-5'))
    expect(screen.getByTestId('total-duration').textContent).toBe('0m 0s')
    expect(screen.getByTestId('song-count').textContent).toBe('0')
  })
})

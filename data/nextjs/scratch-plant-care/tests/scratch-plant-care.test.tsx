import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Plant Care Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: 'Plant Care Tracker' })).toBeTruthy()
  })

  it('renders all 3 plants on load', () => {
    expect(screen.getByTestId('select-plant-1')).toBeTruthy()
    expect(screen.getByTestId('select-plant-2')).toBeTruthy()
    expect(screen.getByTestId('select-plant-3')).toBeTruthy()
  })

  it('shows event count for each plant', () => {
    expect(screen.getByTestId('plant-event-count-1').textContent).toContain('1')
    expect(screen.getByTestId('plant-event-count-2').textContent).toContain('1')
    expect(screen.getByTestId('plant-event-count-3').textContent).toContain('1')
  })

  it('does not show selected plant panel or care form on load', () => {
    expect(screen.queryByTestId('selected-plant')).toBeNull()
    expect(screen.queryByTestId('care-form')).toBeNull()
  })

  it('shows selected plant panel after clicking Select', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('select-plant-1'))
    expect(screen.getByTestId('selected-plant')).toBeTruthy()
    expect(screen.getByTestId('selected-plant').textContent).toContain('Monstera')
  })

  it('shows care form after selecting a plant', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('select-plant-2'))
    expect(screen.getByTestId('care-form')).toBeTruthy()
  })

  it('shows only the selected plant care history', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('select-plant-1'))
    const history = screen.getByTestId('care-history')
    expect(within(history).queryByTestId('delete-event-2')).toBeNull()
    expect(within(history).getByTestId('delete-event-1')).toBeTruthy()
  })

  it('shows no-events-msg when plant has no events', async () => {
    const user = userEvent.setup()
    // Delete the one event for plant 1 first, then re-select
    await user.click(screen.getByTestId('select-plant-1'))
    await user.click(screen.getByTestId('delete-event-1'))
    expect(screen.getByTestId('no-events-msg')).toBeTruthy()
  })

  it('logs a new care event', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('select-plant-1'))
    await user.selectOptions(screen.getByTestId('care-type-select'), 'fertilize')
    fireEvent.change(screen.getByTestId('care-date-input'), { target: { value: '2024-02-01' } })
    await user.type(screen.getByTestId('care-notes-input'), 'Spring feed')
    await user.click(screen.getByTestId('log-care-btn'))
    expect(screen.getByTestId('care-history').textContent).toContain('fertilize')
    expect(screen.getByTestId('care-history').textContent).toContain('Spring feed')
  })

  it('clears form after logging care event', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('select-plant-1'))
    fireEvent.change(screen.getByTestId('care-date-input'), { target: { value: '2024-02-01' } })
    await user.type(screen.getByTestId('care-notes-input'), 'Some notes')
    await user.click(screen.getByTestId('log-care-btn'))
    expect((screen.getByTestId('care-date-input') as HTMLInputElement).value).toBe('')
    expect((screen.getByTestId('care-notes-input') as HTMLTextAreaElement).value).toBe('')
    expect((screen.getByTestId('care-type-select') as HTMLSelectElement).value).toBe('water')
  })

  it('does not log event without a date', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('select-plant-1'))
    const historyBefore = screen.getByTestId('care-history').children.length
    await user.click(screen.getByTestId('log-care-btn'))
    expect(screen.getByTestId('care-history').children.length).toBe(historyBefore)
  })

  it('deletes a care event', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('select-plant-2'))
    expect(screen.getByTestId('delete-event-2')).toBeTruthy()
    await user.click(screen.getByTestId('delete-event-2'))
    expect(screen.queryByTestId('delete-event-2')).toBeNull()
  })

  it('updates event count after adding an event', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('select-plant-1'))
    const before = screen.getByTestId('plant-event-count-1').textContent
    fireEvent.change(screen.getByTestId('care-date-input'), { target: { value: '2024-02-01' } })
    await user.click(screen.getByTestId('log-care-btn'))
    const after = screen.getByTestId('plant-event-count-1').textContent
    expect(before).not.toBe(after)
  })

  it('switching selected plant shows correct history', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('select-plant-1'))
    expect(screen.getByTestId('care-history').textContent).toContain('water')
    await user.click(screen.getByTestId('select-plant-2'))
    expect(screen.getByTestId('care-history').textContent).toContain('fertilize')
  })
})

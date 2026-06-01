import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function addExercise(
  u: ReturnType<typeof userEvent.setup>,
  name: string,
  sets: string,
  reps: string,
  weight: string
) {
  await u.clear(screen.getByLabelText(/exercise name/i))
  await u.type(screen.getByLabelText(/exercise name/i), name)
  await u.clear(screen.getByLabelText(/^sets$/i))
  await u.type(screen.getByLabelText(/^sets$/i), sets)
  await u.clear(screen.getByLabelText(/^reps$/i))
  await u.type(screen.getByLabelText(/^reps$/i), reps)
  await u.clear(screen.getByLabelText(/weight \(kg\)/i))
  await u.type(screen.getByLabelText(/weight \(kg\)/i), weight)
  await u.click(screen.getByRole('button', { name: /add exercise/i }))
}

function liFor(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no li for ${name}`)
  return el as HTMLElement
}

describe('Workout Log', () => {
  it('renders the main heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /workout log/i })).toBeInTheDocument()
  })

  it('shows zero totals when no exercises are logged', () => {
    render(<App />)
    expect(screen.getByText('Total exercises: 0')).toBeInTheDocument()
    expect(screen.getByText('Total session volume: 0 kg')).toBeInTheDocument()
  })

  it('adds an exercise and shows its summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Squat', '3', '10', '60')
    expect(screen.getByText('Squat')).toBeInTheDocument()
    expect(screen.getByText('3 x 10 x 60 kg')).toBeInTheDocument()
  })

  it('shows correct per-exercise volume', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Squat', '3', '10', '60')
    expect(within(liFor('Squat')).getByText('Volume: 1800 kg')).toBeInTheDocument()
  })

  it('updates total exercises count after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Squat', '3', '10', '60')
    expect(screen.getByText('Total exercises: 1')).toBeInTheDocument()
  })

  it('updates total session volume after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Squat', '3', '10', '60')
    expect(screen.getByText('Total session volume: 1800 kg')).toBeInTheDocument()
  })

  it('clears the form inputs after a successful add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Bench Press', '4', '8', '80')
    expect(screen.getByLabelText(/exercise name/i)).toHaveValue('')
    expect(screen.getByLabelText(/^sets$/i)).toHaveValue(null)
    expect(screen.getByLabelText(/^reps$/i)).toHaveValue(null)
    expect(screen.getByLabelText(/weight \(kg\)/i)).toHaveValue(null)
  })

  it('does not add an exercise when name is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, '   ', '3', '10', '60')
    expect(screen.getByText('Total exercises: 0')).toBeInTheDocument()
  })

  it('does not add an exercise when sets is zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Deadlift', '0', '5', '100')
    expect(screen.getByText('Total exercises: 0')).toBeInTheDocument()
  })

  it('does not add an exercise when weight is zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Deadlift', '3', '5', '0')
    expect(screen.getByText('Total exercises: 0')).toBeInTheDocument()
  })

  it('accumulates totals across multiple exercises', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Squat', '3', '10', '60')     // 1800
    await addExercise(u, 'Bench Press', '4', '8', '80') // 2560
    expect(screen.getByText('Total exercises: 2')).toBeInTheDocument()
    expect(screen.getByText('Total session volume: 4360 kg')).toBeInTheDocument()
  })

  it('removes an exercise and updates the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Squat', '3', '10', '60')
    await u.click(within(liFor('Squat')).getByRole('button', { name: /remove/i }))
    expect(screen.queryByText('Squat')).not.toBeInTheDocument()
  })

  it('updates total count after removing an exercise', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Squat', '3', '10', '60')
    await addExercise(u, 'Deadlift', '3', '5', '100')
    await u.click(within(liFor('Squat')).getByRole('button', { name: /remove/i }))
    expect(screen.getByText('Total exercises: 1')).toBeInTheDocument()
  })

  it('updates session volume after removing an exercise', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Squat', '3', '10', '60')      // 1800
    await addExercise(u, 'Deadlift', '3', '5', '100')   // 1500
    await u.click(within(liFor('Squat')).getByRole('button', { name: /remove/i }))
    expect(screen.getByText('Total session volume: 1500 kg')).toBeInTheDocument()
  })

  it('resets to zero totals after removing the only exercise', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Squat', '3', '10', '60')
    await u.click(within(liFor('Squat')).getByRole('button', { name: /remove/i }))
    expect(screen.getByText('Total exercises: 0')).toBeInTheDocument()
    expect(screen.getByText('Total session volume: 0 kg')).toBeInTheDocument()
  })

  it('shows three exercises with correct individual volumes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Squat', '3', '10', '60')      // 1800
    await addExercise(u, 'Bench Press', '4', '8', '80') // 2560
    await addExercise(u, 'Row', '3', '12', '50')        // 1800
    expect(screen.getByText('Total exercises: 3')).toBeInTheDocument()
    expect(within(liFor('Squat')).getByText('Volume: 1800 kg')).toBeInTheDocument()
    expect(within(liFor('Bench Press')).getByText('Volume: 2560 kg')).toBeInTheDocument()
    expect(within(liFor('Row')).getByText('Volume: 1800 kg')).toBeInTheDocument()
    expect(screen.getByText('Total session volume: 6160 kg')).toBeInTheDocument()
  })

  it('keeps other exercises unaffected when one is removed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Squat', '3', '10', '60')
    await addExercise(u, 'Deadlift', '3', '5', '100')
    await u.click(within(liFor('Deadlift')).getByRole('button', { name: /remove/i }))
    expect(screen.getByText('Squat')).toBeInTheDocument()
    expect(screen.queryByText('Deadlift')).not.toBeInTheDocument()
    expect(screen.getByText('Total exercises: 1')).toBeInTheDocument()
    expect(screen.getByText('Total session volume: 1800 kg')).toBeInTheDocument()
  })
})

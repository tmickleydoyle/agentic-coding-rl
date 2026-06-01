// HELD-OUT generalization tests.
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

describe('Workout Log (held-out)', () => {
  it('shows correct summary string for a different exercise', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Overhead Press', '5', '5', '40')
    expect(screen.getByText('5 x 5 x 40 kg')).toBeInTheDocument()
    expect(within(liFor('Overhead Press')).getByText('Volume: 1000 kg')).toBeInTheDocument()
  })

  it('does not add when reps is zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Pull-up', '3', '0', '0')
    expect(screen.getByText('Total exercises: 0')).toBeInTheDocument()
    expect(screen.getByText('Total session volume: 0 kg')).toBeInTheDocument()
  })

  it('accumulates four exercises and reports correct total volume', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Squat', '4', '6', '100')       // 2400
    await addExercise(u, 'Lunge', '3', '12', '30')       // 1080
    await addExercise(u, 'Calf Raise', '4', '15', '20')  // 1200
    await addExercise(u, 'Leg Press', '3', '10', '120')  // 3600
    expect(screen.getByText('Total exercises: 4')).toBeInTheDocument()
    expect(screen.getByText('Total session volume: 8280 kg')).toBeInTheDocument()
  })

  it('removing middle exercise keeps others and updates total correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Curl', '3', '12', '20')        // 720
    await addExercise(u, 'Tricep Ext', '3', '10', '25') // 750
    await addExercise(u, 'Shrug', '4', '10', '60')      // 2400
    await u.click(within(liFor('Tricep Ext')).getByRole('button', { name: /remove/i }))
    expect(screen.queryByText('Tricep Ext')).not.toBeInTheDocument()
    expect(screen.getByText('Curl')).toBeInTheDocument()
    expect(screen.getByText('Shrug')).toBeInTheDocument()
    expect(screen.getByText('Total exercises: 2')).toBeInTheDocument()
    expect(screen.getByText('Total session volume: 3120 kg')).toBeInTheDocument()
  })

  it('add-remove-add cycle maintains correct state', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Run', '1', '1', '70')  // 70
    await u.click(within(liFor('Run')).getByRole('button', { name: /remove/i }))
    await addExercise(u, 'Swim', '2', '5', '80') // 800
    expect(screen.queryByText('Run')).not.toBeInTheDocument()
    expect(screen.getByText('Swim')).toBeInTheDocument()
    expect(screen.getByText('Total exercises: 1')).toBeInTheDocument()
    expect(screen.getByText('Total session volume: 800 kg')).toBeInTheDocument()
  })

  it('renders correct sets x reps x weight string with large numbers', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Farmer Walk', '6', '20', '50')
    expect(screen.getByText('6 x 20 x 50 kg')).toBeInTheDocument()
    expect(within(liFor('Farmer Walk')).getByText('Volume: 6000 kg')).toBeInTheDocument()
  })

  it('form is blank again after second successful add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExercise(u, 'Press', '3', '8', '50')
    await addExercise(u, 'Row', '3', '8', '50')
    expect(screen.getByLabelText(/exercise name/i)).toHaveValue('')
    expect(screen.getByLabelText(/^sets$/i)).toHaveValue(null)
    expect(screen.getByLabelText(/^reps$/i)).toHaveValue(null)
    expect(screen.getByLabelText(/weight \(kg\)/i)).toHaveValue(null)
  })
})

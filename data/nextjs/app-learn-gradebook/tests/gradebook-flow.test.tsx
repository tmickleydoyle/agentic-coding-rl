import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function goGradebook(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('nav-gradebook'))
}

describe('gradebook grid', () => {
  it('prefills grade cells from seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goGradebook(user)
    expect(screen.getByTestId('grade-s1-a1')).toHaveValue(95)
    expect(screen.getByTestId('grade-s1-a2')).toHaveValue(85)
    expect(screen.getByTestId('grade-s2-a1')).toHaveValue(72)
    // s2 has no a2 grade -> empty
    expect(screen.getByTestId('grade-s2-a2')).toHaveValue(null)
  })

  it('shows seeded per-student averages', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goGradebook(user)
    expect(screen.getByTestId('avg-s1-value')).toHaveTextContent('90') // (95+85)/2
    expect(screen.getByTestId('avg-s2-value')).toHaveTextContent('72')
    expect(screen.getByTestId('avg-s3-value')).toHaveTextContent('50')
  })

  it('updates the average after editing a grade', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goGradebook(user)
    await user.clear(screen.getByTestId('grade-s2-a2'))
    await user.type(screen.getByTestId('grade-s2-a2'), '88')
    // s2 now (72+88)/2 = 80
    expect(screen.getByTestId('avg-s2-value')).toHaveTextContent('80')
  })

  it('clamps an over-100 entry to 100', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goGradebook(user)
    await user.clear(screen.getByTestId('grade-s3-a2'))
    await user.type(screen.getByTestId('grade-s3-a2'), '150')
    expect(screen.getByTestId('grade-s3-a2')).toHaveValue(100)
    // s3 now (50+100)/2 = 75
    expect(screen.getByTestId('avg-s3-value')).toHaveTextContent('75')
  })

  it('clearing a grade removes it from the average', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goGradebook(user)
    await user.clear(screen.getByTestId('grade-s1-a2'))
    // s1 now only a1=95
    expect(screen.getByTestId('avg-s1-value')).toHaveTextContent('95')
  })
})

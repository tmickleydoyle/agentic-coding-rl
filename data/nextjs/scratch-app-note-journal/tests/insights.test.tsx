import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('insights', () => {
  it('shows mood counts from seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-insights'))
    expect(screen.getByTestId('count-happy')).toHaveTextContent('1')
    expect(screen.getByTestId('count-neutral')).toHaveTextContent('1')
    expect(screen.getByTestId('count-sad')).toHaveTextContent('1')
    expect(screen.getByTestId('count-total')).toHaveTextContent('3')
  })

  it('updates the top mood after adding happy entries', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    await user.type(screen.getByTestId('body-input'), 'Great day')
    await user.selectOptions(screen.getByTestId('mood-select'), 'happy')
    await user.click(screen.getByTestId('save-entry'))
    await user.click(screen.getByTestId('nav-insights'))
    expect(screen.getByTestId('count-happy')).toHaveTextContent('2')
    expect(screen.getByTestId('top-mood')).toHaveTextContent('happy')
  })

  it('reflects deletions in the counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-entries'))
    await user.click(screen.getByTestId('delete-e3')) // remove the sad entry
    await user.click(screen.getByTestId('nav-insights'))
    expect(screen.getByTestId('count-sad')).toHaveTextContent('0')
    expect(screen.getByTestId('count-total')).toHaveTextContent('2')
  })
})

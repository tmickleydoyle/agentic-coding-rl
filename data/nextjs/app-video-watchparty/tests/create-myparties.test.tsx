import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('create + my-parties flow', () => {
  it('creating a party navigates to parties and shows it under the right filter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.clear(screen.getByTestId('title-input'))
    await user.type(screen.getByTestId('title-input'), 'Late Night Stream')
    await user.clear(screen.getByTestId('time-input'))
    await user.type(screen.getByTestId('time-input'), '300')
    await user.click(screen.getByTestId('create-submit'))
    expect(screen.getByTestId('page-parties')).toBeInTheDocument()
    expect(screen.getByTestId('party-p4-title')).toHaveTextContent('Late Night Stream')
    expect(screen.getByTestId('party-p4-status')).toHaveTextContent('upcoming')
  })

  it('creating a past-dated party only shows under the past filter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('title-input'), 'Old Replay')
    await user.clear(screen.getByTestId('time-input'))
    await user.type(screen.getByTestId('time-input'), '10')
    await user.click(screen.getByTestId('create-submit'))
    expect(screen.queryByTestId('party-p4')).not.toBeInTheDocument()
    await user.click(screen.getByTestId('filter-past'))
    expect(screen.getByTestId('party-p4-title')).toHaveTextContent('Old Replay')
  })

  it('empty title does nothing and stays on create', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.click(screen.getByTestId('create-submit'))
    expect(screen.getByTestId('page-create')).toBeInTheDocument()
  })

  it('shows no-rsvps when nothing rsvped', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-parties'))
    expect(screen.getByTestId('no-rsvps')).toBeInTheDocument()
  })

  it('rsvped parties appear under my-parties with count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-p1'))
    await user.click(screen.getByTestId('rsvp-toggle'))
    await user.click(screen.getByTestId('nav-my-parties'))
    expect(screen.getByTestId('rsvp-count-value')).toHaveTextContent('1')
    expect(screen.getByTestId('mp-p1-title')).toHaveTextContent('React Conf Replay')
    expect(screen.getByTestId('mp-p1-status')).toHaveTextContent('upcoming')
  })
})

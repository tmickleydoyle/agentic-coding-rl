import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TabbedForms from '../components/TabbedForms'

describe('TabbedForms', () => {
  it('starts on General; all statuses empty', () => {
    render(<TabbedForms />)
    expect(screen.getByTestId('tab-general')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('name')).toBeInTheDocument()
    expect(screen.getByTestId('status-general')).toHaveTextContent('')
  })

  it('Save on General only changes status-general', async () => {
    const user = userEvent.setup()
    render(<TabbedForms />)
    await user.type(screen.getByTestId('name'), 'Ada')
    await user.click(screen.getByTestId('save-general'))
    expect(screen.getByTestId('status-general')).toHaveTextContent('Saved: Ada')
    // switch to Contact: its status must still be empty
    await user.click(screen.getByTestId('tab-contact'))
    expect(screen.getByTestId('status-contact')).toHaveTextContent('')
    expect(screen.queryByTestId('name')).toBeNull()
  })

  it('preserves inputs across navigation', async () => {
    const user = userEvent.setup()
    render(<TabbedForms />)
    await user.type(screen.getByTestId('name'), 'Ada')
    await user.click(screen.getByTestId('tab-contact'))
    await user.type(screen.getByTestId('email'), 'a@b.co')
    await user.click(screen.getByTestId('tab-general'))
    expect((screen.getByTestId('name') as HTMLInputElement).value).toBe('Ada')
    await user.click(screen.getByTestId('tab-contact'))
    expect((screen.getByTestId('email') as HTMLInputElement).value).toBe('a@b.co')
  })

  it('per-tab statuses are independent across saves', async () => {
    const user = userEvent.setup()
    render(<TabbedForms />)
    await user.type(screen.getByTestId('name'), 'Ada')
    await user.click(screen.getByTestId('save-general'))
    await user.click(screen.getByTestId('tab-contact'))
    await user.type(screen.getByTestId('email'), 'a@b.co')
    await user.click(screen.getByTestId('save-contact'))
    // go back to General — its saved status must still be the old one
    await user.click(screen.getByTestId('tab-general'))
    expect(screen.getByTestId('status-general')).toHaveTextContent('Saved: Ada')
    // Contact still has its own saved status when revisited
    await user.click(screen.getByTestId('tab-contact'))
    expect(screen.getByTestId('status-contact')).toHaveTextContent('Saved: a@b.co')
  })

  it('Bio textarea + save works the same way', async () => {
    const user = userEvent.setup()
    render(<TabbedForms />)
    await user.click(screen.getByTestId('tab-bio'))
    await user.type(screen.getByTestId('bio'), 'hello world')
    await user.click(screen.getByTestId('save-bio'))
    expect(screen.getByTestId('status-bio')).toHaveTextContent('Saved: hello world')
  })
})

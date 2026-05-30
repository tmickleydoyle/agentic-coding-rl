import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('editor preview', () => {
  it('blocks saving with an empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('new-note'))
    await user.click(screen.getByTestId('save-note'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-editor')).toBeInTheDocument()
  })

  it('renders a live HTML preview as you type', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('new-note'))
    await user.type(screen.getByTestId('body-input'), '# Big')
    const preview = screen.getByTestId('preview')
    expect(within(preview).getByText('Big').tagName).toBe('H1')
  })

  it('updates the live word count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('new-note'))
    await user.type(screen.getByTestId('body-input'), 'one two three four')
    expect(screen.getByTestId('live-words')).toHaveTextContent('4')
  })

  it('prefills the editor when editing an existing note', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('edit-m1'))
    const title = screen.getByTestId('title-input') as HTMLInputElement
    expect(title.value).toBe('Welcome')
    const tags = screen.getByTestId('tags-input') as HTMLInputElement
    expect(tags.value).toContain('intro')
  })

  it('edits an existing note and shows the new title in the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('edit-m1'))
    const title = screen.getByTestId('title-input')
    await user.clear(title)
    await user.type(title, 'Greetings')
    await user.click(screen.getByTestId('save-note'))
    expect(within(screen.getByTestId('note-list')).getByText('Greetings')).toBeInTheDocument()
  })
})

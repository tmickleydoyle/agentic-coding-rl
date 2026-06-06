import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TagInput from '../components/TagInput'

describe('TagInput', () => {
  it('renders the input and empty tag list', () => {
    render(<TagInput />)
    expect(screen.getByTestId('tag-input')).toBeDefined()
    expect(screen.getByTestId('tag-list')).toBeDefined()
  })

  it('adds a tag when Enter is pressed', async () => {
    const user = userEvent.setup()
    render(<TagInput />)
    await user.type(screen.getByTestId('tag-input'), 'react{Enter}')
    expect(screen.getByTestId('tag-react')).toBeDefined()
  })

  it('clears the input after adding a tag', async () => {
    const user = userEvent.setup()
    render(<TagInput />)
    const input = screen.getByTestId('tag-input')
    await user.type(input, 'react{Enter}')
    expect((input as HTMLInputElement).value).toBe('')
  })

  it('does not add empty tags', async () => {
    const user = userEvent.setup()
    render(<TagInput />)
    await user.type(screen.getByTestId('tag-input'), '{Enter}')
    expect(screen.getByTestId('tag-list').children.length).toBe(0)
  })

  it('does not add duplicate tags', async () => {
    const user = userEvent.setup()
    render(<TagInput />)
    await user.type(screen.getByTestId('tag-input'), 'react{Enter}')
    await user.type(screen.getByTestId('tag-input'), 'react{Enter}')
    expect(screen.getAllByTestId('tag-react').length).toBe(1)
  })

  it('removes a tag when remove button is clicked', async () => {
    const user = userEvent.setup()
    render(<TagInput />)
    await user.type(screen.getByTestId('tag-input'), 'react{Enter}')
    await user.click(screen.getByTestId('remove-react'))
    expect(screen.queryByTestId('tag-react')).toBeNull()
  })

  it('can add multiple distinct tags', async () => {
    const user = userEvent.setup()
    render(<TagInput />)
    await user.type(screen.getByTestId('tag-input'), 'react{Enter}')
    await user.type(screen.getByTestId('tag-input'), 'typescript{Enter}')
    expect(screen.getByTestId('tag-react')).toBeDefined()
    expect(screen.getByTestId('tag-typescript')).toBeDefined()
  })
})

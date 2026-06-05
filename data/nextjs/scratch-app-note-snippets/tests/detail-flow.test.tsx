import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('detail flow', () => {
  it('opens a snippet and shows its details', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s2'))
    expect(screen.getByTestId('page-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Quick sort')
    expect(screen.getByTestId('detail-language')).toHaveTextContent('python')
    expect(screen.getByTestId('detail-copies')).toHaveTextContent('2')
  })

  it('copying increments the copy count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s1'))
    expect(screen.getByTestId('detail-copies')).toHaveTextContent('0')
    await user.click(screen.getByTestId('copy-snippet'))
    expect(screen.getByTestId('detail-copies')).toHaveTextContent('1')
    await user.click(screen.getByTestId('copy-snippet'))
    expect(screen.getByTestId('detail-copies')).toHaveTextContent('2')
  })

  it('toggling favorite on detail reflects on the favorites page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s1'))
    await user.click(screen.getByTestId('toggle-fav'))
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('favorite-s1')).toBeInTheDocument()
  })

  it('deleting a snippet returns to the list without it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s3'))
    await user.click(screen.getByTestId('delete-snippet'))
    expect(screen.getByTestId('page-snippets')).toBeInTheDocument()
    expect(screen.queryByTestId('snippet-s3')).not.toBeInTheDocument()
  })

  it('the copy count persists when navigating back to the list and reopening', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s1'))
    await user.click(screen.getByTestId('copy-snippet'))
    await user.click(screen.getByTestId('nav-snippets'))
    await user.click(screen.getByTestId('open-s1'))
    expect(screen.getByTestId('detail-copies')).toHaveTextContent('1')
  })
})

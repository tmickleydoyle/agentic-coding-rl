import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Thread from '../components/Thread'
import type { Comment } from '../components/types'

const SEED: Comment[] = [
  { id: 1, text: 'First post', replies: [] },
]

describe('Comment thread', () => {
  it('renders seeded top-level comments', () => {
    render(<Thread initial={SEED} />)
    expect(screen.getByTestId('text-1')).toHaveTextContent('First post')
  })

  it('starts empty when no initial given', () => {
    render(<Thread />)
    expect(within(screen.getByTestId('thread')).queryAllByTestId(/^comment-/)).toHaveLength(0)
  })

  it('adds a top-level comment via the root box', async () => {
    const user = userEvent.setup()
    render(<Thread />)
    await user.type(screen.getByTestId('root-input'), 'Hello world')
    await user.click(screen.getByTestId('root-btn'))
    const roots = within(screen.getByTestId('thread')).getAllByTestId(/^comment-/)
    expect(roots.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('ignores empty/whitespace root submissions', async () => {
    const user = userEvent.setup()
    render(<Thread />)
    await user.type(screen.getByTestId('root-input'), '   ')
    await user.click(screen.getByTestId('root-btn'))
    expect(within(screen.getByTestId('thread')).queryAllByTestId(/^comment-/)).toHaveLength(0)
  })

  it('adds a nested reply under a comment', async () => {
    const user = userEvent.setup()
    render(<Thread initial={SEED} />)
    await user.type(screen.getByTestId('reply-input-1'), 'A reply')
    await user.click(screen.getByTestId('reply-btn-1'))
    const replies = screen.getByTestId('replies-1')
    expect(within(replies).getByText('A reply')).toBeInTheDocument()
  })

  it('supports replies to replies (deep nesting)', async () => {
    const user = userEvent.setup()
    render(<Thread initial={SEED} />)
    await user.type(screen.getByTestId('reply-input-1'), 'level 2')
    await user.click(screen.getByTestId('reply-btn-1'))
    // the new reply gets id 2 (max id + 1)
    expect(screen.getByTestId('text-2')).toHaveTextContent('level 2')
    await user.type(screen.getByTestId('reply-input-2'), 'level 3')
    await user.click(screen.getByTestId('reply-btn-2'))
    expect(within(screen.getByTestId('replies-2')).getByText('level 3')).toBeInTheDocument()
  })

  it('clears the input after a successful reply', async () => {
    const user = userEvent.setup()
    render(<Thread initial={SEED} />)
    const input = screen.getByTestId('reply-input-1') as HTMLInputElement
    await user.type(input, 'cleared?')
    await user.click(screen.getByTestId('reply-btn-1'))
    expect(input.value).toBe('')
  })

  it('reply box under one comment does not add to a sibling', async () => {
    const user = userEvent.setup()
    render(<Thread />)
    // create two roots
    await user.type(screen.getByTestId('root-input'), 'root A')
    await user.click(screen.getByTestId('root-btn'))
    await user.type(screen.getByTestId('root-input'), 'root B')
    await user.click(screen.getByTestId('root-btn'))
    const rootAId = screen.getByText('root A').getAttribute('data-testid')!.replace('text-', '')
    await user.type(screen.getByTestId(`reply-input-${rootAId}`), 'child of A')
    await user.click(screen.getByTestId(`reply-btn-${rootAId}`))
    expect(screen.getByTestId(`replies-${rootAId}`)).toBeInTheDocument()
    const rootBId = screen.getByText('root B').getAttribute('data-testid')!.replace('text-', '')
    expect(screen.queryByTestId(`replies-${rootBId}`)).toBeNull()
  })
})

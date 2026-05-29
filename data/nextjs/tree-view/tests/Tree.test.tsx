import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Tree from '../components/Tree'
import type { TreeNode } from '../components/types'

const ROOTS: TreeNode[] = [
  {
    id: 'a',
    label: 'Animals',
    children: [
      { id: 'a1', label: 'Cat' },
      {
        id: 'a2',
        label: 'Dogs',
        children: [{ id: 'a2x', label: 'Poodle' }],
      },
    ],
  },
  { id: 'b', label: 'Plants' },
]

describe('Tree view', () => {
  it('renders root labels and starts collapsed', () => {
    render(<Tree roots={ROOTS} />)
    expect(screen.getByTestId('label-a')).toHaveTextContent('Animals')
    expect(screen.getByTestId('label-b')).toHaveTextContent('Plants')
    expect(screen.queryByTestId('children-a')).toBeNull()
    expect(screen.queryByTestId('label-a1')).toBeNull()
  })

  it('leaf nodes have no toggle button', () => {
    render(<Tree roots={ROOTS} />)
    expect(screen.queryByTestId('toggle-b')).toBeNull()
    expect(screen.getByTestId('toggle-a')).toBeInTheDocument()
  })

  it('toggle shows + when collapsed and - when expanded', async () => {
    const user = userEvent.setup()
    render(<Tree roots={ROOTS} />)
    expect(screen.getByTestId('toggle-a')).toHaveTextContent('+')
    await user.click(screen.getByTestId('toggle-a'))
    expect(screen.getByTestId('toggle-a')).toHaveTextContent('-')
  })

  it('expanding reveals direct children only (nested stays collapsed)', async () => {
    const user = userEvent.setup()
    render(<Tree roots={ROOTS} />)
    await user.click(screen.getByTestId('toggle-a'))
    expect(screen.getByTestId('children-a')).toBeInTheDocument()
    expect(screen.getByTestId('label-a1')).toHaveTextContent('Cat')
    expect(screen.getByTestId('label-a2')).toHaveTextContent('Dogs')
    // grandchild hidden until 'a2' is expanded
    expect(screen.queryByTestId('label-a2x')).toBeNull()
  })

  it('expanding a nested node reveals its grandchild', async () => {
    const user = userEvent.setup()
    render(<Tree roots={ROOTS} />)
    await user.click(screen.getByTestId('toggle-a'))
    await user.click(screen.getByTestId('toggle-a2'))
    expect(screen.getByTestId('label-a2x')).toHaveTextContent('Poodle')
  })

  it('collapsing hides descendants again', async () => {
    const user = userEvent.setup()
    render(<Tree roots={ROOTS} />)
    await user.click(screen.getByTestId('toggle-a'))
    await user.click(screen.getByTestId('toggle-a2'))
    expect(screen.getByTestId('label-a2x')).toBeInTheDocument()
    await user.click(screen.getByTestId('toggle-a'))
    expect(screen.queryByTestId('label-a1')).toBeNull()
    expect(screen.queryByTestId('label-a2x')).toBeNull()
  })

  it('sibling expansion is independent', async () => {
    const user = userEvent.setup()
    render(<Tree roots={ROOTS} />)
    await user.click(screen.getByTestId('toggle-a'))
    // expanding 'a' must not reveal anything under sibling root 'b' (it has none anyway)
    expect(screen.queryByTestId('children-b')).toBeNull()
    // expanding nested 'a2' should not auto-expand sibling leaf 'a1' (no children to show)
    await user.click(screen.getByTestId('toggle-a2'))
    expect(screen.queryByTestId('toggle-a1')).toBeNull()
  })
})

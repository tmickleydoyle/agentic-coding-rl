import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Editor from '../components/Editor'

function edit(v: string) {
  fireEvent.change(screen.getByTestId('input'), { target: { value: v } })
}

describe('Editor / useUndoable', () => {
  it('starts empty with undo and redo disabled', () => {
    render(<Editor />)
    expect(screen.getByTestId('value')).toHaveTextContent('')
    expect(screen.getByTestId('undo')).toBeDisabled()
    expect(screen.getByTestId('redo')).toBeDisabled()
  })

  it('records edits and reflects the latest value', () => {
    render(<Editor />)
    edit('a')
    edit('ab')
    expect(screen.getByTestId('value')).toHaveTextContent('ab')
    expect(screen.getByTestId('undo')).not.toBeDisabled()
  })

  it('undo walks back through history one step at a time', () => {
    render(<Editor />)
    edit('a')
    edit('ab')
    fireEvent.click(screen.getByTestId('undo'))
    expect(screen.getByTestId('value')).toHaveTextContent('a')
    fireEvent.click(screen.getByTestId('undo'))
    expect(screen.getByTestId('value')).toHaveTextContent('')
  })

  it('redo re-applies an undone edit', () => {
    render(<Editor />)
    edit('a')
    edit('ab')
    fireEvent.click(screen.getByTestId('undo'))
    fireEvent.click(screen.getByTestId('redo'))
    expect(screen.getByTestId('value')).toHaveTextContent('ab')
  })

  it('a new edit after undo clears the redo future (the bug)', () => {
    render(<Editor />)
    edit('a')
    edit('ab')
    fireEvent.click(screen.getByTestId('undo')) // back to 'a'
    edit('aX') // new branch — 'ab' future must be discarded
    expect(screen.getByTestId('value')).toHaveTextContent('aX')
    expect(screen.getByTestId('redo')).toBeDisabled()
    // pressing redo must NOT resurrect the stale 'ab'
    fireEvent.click(screen.getByTestId('redo'))
    expect(screen.getByTestId('value')).toHaveTextContent('aX')
  })

  it('undo stops at the initial state and never goes past it (the bug)', () => {
    render(<Editor />)
    edit('a')
    fireEvent.click(screen.getByTestId('undo')) // back to ''
    expect(screen.getByTestId('value')).toHaveTextContent('')
    expect(screen.getByTestId('undo')).toBeDisabled()
    // extra undo clicks must be no-ops, value must remain '' (not undefined)
    fireEvent.click(screen.getByTestId('undo'))
    fireEvent.click(screen.getByTestId('undo'))
    expect(screen.getByTestId('value')).toHaveTextContent('')
    // because undo never went past the initial state, a single redo restores 'a'
    // (a buggy hook that ran the pointer negative would redo into a blank state)
    fireEvent.click(screen.getByTestId('redo'))
    expect(screen.getByTestId('value')).toHaveTextContent('a')
  })

  it('redo is disabled when there is nothing to redo', () => {
    render(<Editor />)
    edit('a')
    expect(screen.getByTestId('redo')).toBeDisabled()
  })

  it('supports a full undo/redo round trip across several edits', () => {
    render(<Editor />)
    edit('a')
    edit('ab')
    edit('abc')
    fireEvent.click(screen.getByTestId('undo')) // ab
    fireEvent.click(screen.getByTestId('undo')) // a
    expect(screen.getByTestId('value')).toHaveTextContent('a')
    fireEvent.click(screen.getByTestId('redo')) // ab
    fireEvent.click(screen.getByTestId('redo')) // abc
    expect(screen.getByTestId('value')).toHaveTextContent('abc')
    expect(screen.getByTestId('redo')).toBeDisabled()
  })
})

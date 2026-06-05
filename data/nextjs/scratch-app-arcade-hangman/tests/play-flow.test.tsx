import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('play flow', () => {
  it('reveals correctly guessed letters', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('key-c'))
    expect(screen.getByTestId('masked')).toHaveTextContent('c__')
    expect(screen.getByTestId('key-c')).toBeDisabled()
    expect(screen.getByTestId('remaining')).toHaveTextContent('6')
  })

  it('a wrong guess reduces remaining chances', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('key-z'))
    expect(screen.getByTestId('remaining')).toHaveTextContent('5')
  })

  it('winning the word marks a win and locks the keyboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    for (const l of ['c', 'a', 't']) {
      await user.click(screen.getByTestId(`key-${l}`))
    }
    expect(screen.getByTestId('status')).toHaveTextContent('won')
    expect(screen.getByTestId('game-over')).toBeInTheDocument()
    expect(screen.getByTestId('key-b')).toBeDisabled()
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('wins')).toHaveTextContent('1')
  })

  it('losing the word marks a loss and reveals it', async () => {
    const user = userEvent.setup()
    render(<App />)
    for (const l of ['b', 'd', 'e', 'f', 'g', 'h']) {
      await user.click(screen.getByTestId(`key-${l}`))
    }
    expect(screen.getByTestId('status')).toHaveTextContent('lost')
    expect(screen.getByTestId('masked')).toHaveTextContent('cat')
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('losses')).toHaveTextContent('1')
    expect(screen.getByTestId('win-rate')).toHaveTextContent('0')
  })

  it('reset restarts the current word', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('key-c'))
    await user.click(screen.getByTestId('reset'))
    expect(screen.getByTestId('masked')).toHaveTextContent('___')
    expect(screen.getByTestId('key-c')).not.toBeDisabled()
  })

  it('next-word advances to the next word (react)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('next-word'))
    expect(screen.getByTestId('masked')).toHaveTextContent('_____')
    // 'react' has five letters
    await user.click(screen.getByTestId('key-r'))
    expect(screen.getByTestId('masked')).toHaveTextContent('r____')
  })

  it('win rate reflects mixed results', async () => {
    const user = userEvent.setup()
    render(<App />)
    // win cat
    for (const l of ['c', 'a', 't']) await user.click(screen.getByTestId(`key-${l}`))
    // next word react, lose it
    await user.click(screen.getByTestId('next-word'))
    for (const l of ['b', 'd', 'f', 'g', 'h', 'k']) await user.click(screen.getByTestId(`key-${l}`))
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('played')).toHaveTextContent('2')
    expect(screen.getByTestId('win-rate')).toHaveTextContent('50')
    await user.click(screen.getByTestId('clear-stats'))
    expect(screen.getByTestId('played')).toHaveTextContent('0')
  })
})

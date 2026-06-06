import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { GamesPage } from '../reference/app/games/page'
import { AchievementsPage } from '../reference/app/achievements/page'
import { __reset } from '../reference/lib/store'

beforeEach(() => { __reset() })

describe('Games Page', () => {
  it('shows 3 seed games', async () => {
    render(<GamesPage />)
    await waitFor(() => expect(screen.getAllByTestId('game-item').length).toBe(3))
  })

  it('filters by completed', async () => {
    render(<GamesPage />)
    await waitFor(() => screen.getAllByTestId('game-item'))
    fireEvent.change(screen.getByTestId('game-status-filter'), { target: { value: 'completed' } })
    expect(screen.getAllByTestId('game-item').length).toBe(1)
  })

  it('adds a new game', async () => {
    render(<GamesPage />)
    await waitFor(() => screen.getAllByTestId('game-item'))
    fireEvent.change(screen.getByTestId('game-title-input'), { target: { value: 'Cyberpunk 2077' } })
    fireEvent.change(screen.getByTestId('game-platform-input'), { target: { value: 'PC' } })
    fireEvent.change(screen.getByTestId('game-genre-input'), { target: { value: 'RPG' } })
    fireEvent.click(screen.getByTestId('submit-game'))
    await waitFor(() => expect(screen.getAllByTestId('game-item').length).toBe(4))
  })

  it('deletes a game', async () => {
    render(<GamesPage />)
    await waitFor(() => screen.getAllByTestId('game-item'))
    fireEvent.click(screen.getAllByTestId('delete-game')[0])
    await waitFor(() => expect(screen.getAllByTestId('game-item').length).toBe(2))
  })
})

describe('Achievements Page', () => {
  it('shows 2 seed achievements', async () => {
    render(<AchievementsPage />)
    await waitFor(() => expect(screen.getAllByTestId('achievement-item').length).toBe(2))
  })
})

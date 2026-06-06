import { Habit, Completion } from './types'
export const TODAY = '2026-06-06'
export function getHabits(): Habit[] { return [] }
export function addHabit(_d: Omit<Habit, 'id'>): Habit { return { id: '', name: '', color: '' } }
export function getCompletions(): Completion[] { return [] }
export function addCompletion(_d: { habitId: string; date: string }): Completion { return { id: '', habitId: '', date: '' } }
export function computeStreak(_habitId: string, _today: string): number { return 0 }
export function __reset(): void {}

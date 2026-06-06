import { Habit, HabitLog } from './types'
export const TODAY = '2026-06-06'
export function getHabits(): Habit[] { return [] }
export function addHabit(_d: Omit<Habit, 'id'>): Habit { return { id: '', name: '', frequency: 'daily', category: '' } }
export function getLogs(): HabitLog[] { return [] }
export function upsertLog(_d: { habitId: string; date: string; completed: boolean }): HabitLog { return { id: '', habitId: '', date: '', completed: false } }
export function __reset(): void {}

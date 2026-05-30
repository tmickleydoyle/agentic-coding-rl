import type { VocabList, Word } from './types'

export function checkAnswer(word: Word, guess: string): boolean {
  return word.answer.trim().toLowerCase() === guess.trim().toLowerCase()
}

export function nextMastery(current: number, correct: boolean): number {
  return correct ? Math.min(3, current + 1) : 0
}

export function masteryLabel(level: number): string {
  switch (level) {
    case 0:
      return 'New'
    case 1:
      return 'Learning'
    case 2:
      return 'Familiar'
    default:
      return 'Mastered'
  }
}

export function listProgress(list: VocabList): { mastered: number; total: number; percent: number } {
  const total = list.words.length
  const mastered = list.words.filter((w) => w.mastery === 3).length
  const percent = total === 0 ? 0 : Math.round((mastered / total) * 100)
  return { mastered, total, percent }
}

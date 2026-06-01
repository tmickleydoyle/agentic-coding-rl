import type { VocabList, Word } from './types'
import { seedLists } from './seed'
import { checkAnswer, nextMastery } from './vocab'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let lists: VocabList[] = []

function seed(): void {
  lists = seedLists()
}

seed()

export function __reset(): void {
  seed()
}

export function listLists(): VocabList[] {
  return lists.slice()
}

export function findList(id: string): VocabList | undefined {
  return lists.find((l) => l.id === id)
}

export function addWord(listId: string, input: { term: string; answer: string }): Word | undefined {
  const list = lists.find((l) => l.id === listId)
  if (!list) return undefined
  let n = list.words.length + 1
  while (list.words.some((w) => w.id === `${listId}-w${n}`)) n += 1
  const word: Word = { id: `${listId}-w${n}`, term: input.term, answer: input.answer, mastery: 0 }
  list.words.push(word)
  return word
}

export function answerWord(
  listId: string,
  wordId: string,
  guess: string,
): { correct: boolean; mastery: number } | undefined {
  const list = lists.find((l) => l.id === listId)
  if (!list) return undefined
  const word = list.words.find((w) => w.id === wordId)
  if (!word) return undefined
  const correct = checkAnswer(word, guess)
  word.mastery = nextMastery(word.mastery, correct)
  return { correct, mastery: word.mastery }
}

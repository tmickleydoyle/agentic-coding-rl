'use client'
import { useApp } from '../components/AppStateProvider'
import { checkAnswer, listProgress, masteryLabel, nextMastery } from '../lib/vocab'
import type { VocabList, Word } from '../lib/types'

export { checkAnswer, listProgress, masteryLabel, nextMastery }

export function findList(lists: VocabList[], id: string | null): VocabList | undefined {
  if (!id) return undefined
  return lists.find((l) => l.id === id)
}

export function useActiveList(): { list: VocabList | undefined; word: Word | undefined } {
  const { lists, activeListId, practiceIndex } = useApp()
  const list = findList(lists, activeListId)
  const word = list && list.words.length > 0 ? list.words[practiceIndex % list.words.length] : undefined
  return { list, word }
}

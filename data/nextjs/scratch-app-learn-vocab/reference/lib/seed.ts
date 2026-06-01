import type { VocabList } from './types'

export function seedLists(): VocabList[] {
  return [
    {
      id: 'l1',
      name: 'Spanish',
      words: [
        { id: 'l1-w1', term: 'dog', answer: 'perro', mastery: 0 },
        { id: 'l1-w2', term: 'cat', answer: 'gato', mastery: 1 },
        { id: 'l1-w3', term: 'house', answer: 'casa', mastery: 3 },
      ],
    },
    {
      id: 'l2',
      name: 'French',
      words: [{ id: 'l2-w1', term: 'yes', answer: 'oui', mastery: 2 }],
    },
  ]
}

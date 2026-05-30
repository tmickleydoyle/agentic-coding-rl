import type { Deck } from './types'

export function seedDecks(): Deck[] {
  return [
    {
      id: 'd1',
      name: 'Spanish',
      cards: [
        { id: 'd1-c1', front: 'hola', back: 'hello', dueDay: 0, interval: 1 },
        { id: 'd1-c2', front: 'gato', back: 'cat', dueDay: 0, interval: 2 },
        { id: 'd1-c3', front: 'perro', back: 'dog', dueDay: 3, interval: 4 },
      ],
    },
    {
      id: 'd2',
      name: 'Capitals',
      cards: [{ id: 'd2-c1', front: 'France', back: 'Paris', dueDay: 0, interval: 1 }],
    },
  ]
}

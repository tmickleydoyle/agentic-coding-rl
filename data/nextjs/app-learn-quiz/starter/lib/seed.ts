import type { Quiz } from './types'

// Shared seed used by both the client provider and the server store. Each consumer
// copies it so mutations stay isolated.
export function seedQuizzes(): Quiz[] {
  return [
    {
      id: 'q1',
      title: 'Geography Basics',
      passScore: 2,
      questions: [
        {
          id: 'q1a',
          prompt: 'Capital of France?',
          answerId: 'c1',
          choices: [
            { id: 'c1', text: 'Paris' },
            { id: 'c2', text: 'Berlin' },
            { id: 'c3', text: 'Madrid' },
          ],
        },
        {
          id: 'q1b',
          prompt: 'Largest ocean?',
          answerId: 'c2',
          choices: [
            { id: 'c1', text: 'Atlantic' },
            { id: 'c2', text: 'Pacific' },
            { id: 'c3', text: 'Indian' },
          ],
        },
        {
          id: 'q1c',
          prompt: 'Continent of Egypt?',
          answerId: 'c3',
          choices: [
            { id: 'c1', text: 'Asia' },
            { id: 'c2', text: 'Europe' },
            { id: 'c3', text: 'Africa' },
          ],
        },
      ],
    },
    {
      id: 'q2',
      title: 'Math Basics',
      passScore: 1,
      questions: [
        {
          id: 'q2a',
          prompt: '2 + 2 = ?',
          answerId: 'c2',
          choices: [
            { id: 'c1', text: '3' },
            { id: 'c2', text: '4' },
            { id: 'c3', text: '5' },
          ],
        },
      ],
    },
  ]
}

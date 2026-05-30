import type { Course } from './types'

export function seedCourses(): Course[] {
  return [
    {
      id: 'c1',
      title: 'Intro to React',
      lessons: [
        { id: 'l1', title: 'JSX' },
        { id: 'l2', title: 'Props' },
        { id: 'l3', title: 'State' },
        { id: 'l4', title: 'Effects' },
      ],
    },
    {
      id: 'c2',
      title: 'TypeScript 101',
      lessons: [
        { id: 'l1', title: 'Types' },
        { id: 'l2', title: 'Generics' },
      ],
    },
    {
      id: 'c3',
      title: 'CSS Layout',
      lessons: [
        { id: 'l1', title: 'Flexbox' },
        { id: 'l2', title: 'Grid' },
        { id: 'l3', title: 'Positioning' },
      ],
    },
  ]
}

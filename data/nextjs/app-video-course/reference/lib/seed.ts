import type { Course } from './types'

export function seedCourses(): Course[] {
  return [
    {
      id: 'c1',
      title: 'React Mastery',
      modules: [
        {
          id: 'm1',
          title: 'Basics',
          lessons: [
            { id: 'l1', title: 'JSX', duration: 300 },
            { id: 'l2', title: 'Props', duration: 420 },
          ],
        },
        {
          id: 'm2',
          title: 'Hooks',
          lessons: [
            { id: 'l3', title: 'useState', duration: 360 },
            { id: 'l4', title: 'useEffect', duration: 480 },
          ],
        },
      ],
    },
    {
      id: 'c2',
      title: 'CSS Pro',
      modules: [
        {
          id: 'm1',
          title: 'Layout',
          lessons: [
            { id: 'l1', title: 'Flexbox', duration: 300 },
            { id: 'l2', title: 'Grid', duration: 300 },
          ],
        },
      ],
    },
  ]
}

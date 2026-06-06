# Course Builder App

Build a multi-route course builder with four views: Home, Modules, Lessons, and Preview.

## Seed Data
- Course: { title: "Introduction to Programming", description: "Learn the basics of coding", published: false }
- Modules: [
    { id: 1, title: "Getting Started", order: 1, lessonCount: 2 },
    { id: 2, title: "Variables & Types", order: 2, lessonCount: 1 }
  ]
- Lessons: [
    { id: 1, moduleId: 1, title: "What is Programming?", type: "video", duration: 10 },
    { id: 2, moduleId: 1, title: "Your First Program", type: "exercise", duration: 20 },
    { id: 3, moduleId: 2, title: "Understanding Variables", type: "video", duration: 15 }
  ]

## Routes / Pages
- **Home** (`home`): Shows course title and description. Module count and lesson count. Buttons: "Edit Modules" → modules, "Edit Lessons" → lessons. "Publish Course" button toggles published state; shows "Published" or "Draft" badge.
- **Modules** (`modules`): Lists modules with title and order. Form to add module (title input + "Add Module" button). Each module has a delete button. Modules shown in order.
- **Lessons** (`lessons`): Lists lessons with title, type, duration. Dropdown to filter by module ("All" + module names). Form to add lesson: module select, title input, type select (video/exercise/reading), duration number input, "Add Lesson" button.
- **Preview** (`preview`): Shows course outline — modules in order, each with nested lesson list. Shows total duration (sum of all lesson durations in minutes) formatted as "X min".

## Behaviors
- GET `/api/courses` → `{ course, modules, lessons }`
- POST `/api/courses?type=module` with `{ title }` → add module (order = current max + 1)
- DELETE `/api/courses?type=module` with `{ id }` → remove module and its lessons
- POST `/api/courses?type=lesson` with `{ moduleId, title, type, duration }` → add lesson
- PATCH `/api/courses?type=publish` → toggle published state
- Module title must not be empty (400); lesson duration must be > 0 (400).

## Fields
- Course: `{ title: string, description: string, published: boolean }`
- Module: `{ id: number, title: string, order: number, lessonCount: number }`
- Lesson: `{ id: number, moduleId: number, title: string, type: string, duration: number }`

## Edge Cases
- Deleting a module removes all its lessons.
- Preview shows modules sorted by order.
- Total duration sums all lessons across all modules.
- Empty module title returns 400.

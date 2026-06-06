# Skill Tree App

Build a multi-route skill tree app with four views: Home, Skills, Paths, and Progress.

## Seed Data
- Skills: [
    { id: 1, name: "HTML Basics", category: "Frontend", level: 1, prerequisites: [] },
    { id: 2, name: "CSS Styling", category: "Frontend", level: 1, prerequisites: [] },
    { id: 3, name: "JavaScript Fundamentals", category: "Frontend", level: 2, prerequisites: [1] },
    { id: 4, name: "React", category: "Frontend", level: 3, prerequisites: [3] },
    { id: 5, name: "Node.js", category: "Backend", level: 2, prerequisites: [3] },
    { id: 6, name: "Databases", category: "Backend", level: 2, prerequisites: [] }
  ]
- Paths: [
    { id: 1, name: "Frontend Developer", skillIds: [1, 2, 3, 4] },
    { id: 2, name: "Full Stack Developer", skillIds: [1, 2, 3, 4, 5, 6] }
  ]
- Learner progress: [
    { skillId: 1, status: "completed" },
    { skillId: 2, status: "completed" },
    { skillId: 3, status: "in_progress" },
    { skillId: 4, status: "locked" },
    { skillId: 5, status: "locked" },
    { skillId: 6, status: "available" }
  ]

## Routes / Pages
- **Home** (`home`): Shows "Skill Tree" title. Completed skills count (status=completed). In-progress count. Buttons: "Browse Skills" → skills, "Learning Paths" → paths.
- **Skills** (`skills`): Lists all skills with name, category, level badge (e.g. "Level 1"), status badge (completed/in_progress/available/locked). Clicking "Start" on available skill sets it to in_progress. Clicking "Complete" on in_progress sets it to completed and unlocks skills whose prerequisites are all completed.
- **Paths** (`paths`): Lists learning paths with name and skill count. Each path shows completion percentage (completed skills in path / total skills in path). Clicking a path shows its skills list inline.
- **Progress** (`progress`): Progress summary: completed skills list, in-progress skills list, overall percentage. Shows category breakdown: per category, how many completed vs total.

## Behaviors
- GET `/api/skills` → `{ skills, paths, progress }`
- PATCH `/api/skills?type=progress` with `{ skillId, status }` → update skill status
- When completing a skill, automatically unlock (set to "available") any skills whose all prerequisites are now completed.
- Cannot complete a locked skill (400). Cannot start a completed skill (400).
- Locked skill: not all prerequisites completed.

## Fields
- Skill: `{ id: number, name: string, category: string, level: number, prerequisites: number[] }`
- Path: `{ id: number, name: string, skillIds: number[] }`
- LearnerProgress: `{ skillId: number, status: "completed" | "in_progress" | "available" | "locked" }`

## Edge Cases
- Completing a prerequisite skill auto-unlocks dependent skills.
- Progress page overall percentage = completed / total.
- Path completion percentage rounds to whole number.

# scratch-app-skill-tracker

## Overview
A skill tracker app for logging learning progress, tracking resources, and monitoring skill development over time.

## Routes
- `/` — Dashboard: total skills, hours logged this week, skills at advanced level
- `/skills` — Skills list with categories and proficiency levels
- `/progress` — Progress log entries (learning sessions)
- `/resources` — Learning resources linked to skills

## Data Model

### Skill
```ts
interface Skill {
  id: string;
  name: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  hoursTotal: number;
}
```

### ProgressEntry
```ts
interface ProgressEntry {
  id: string;
  skillId: string;
  date: string; // YYYY-MM-DD
  hoursLogged: number;
  notes: string;
}
```

### Resource
```ts
interface Resource {
  id: string;
  skillId: string;
  title: string;
  url: string;
  type: "article" | "video" | "course" | "book";
  completed: boolean;
}
```

## Seed Data

Skills:
1. id:"sk1", name:"React", category:"Frontend", level:"advanced", hoursTotal:120
2. id:"sk2", name:"Go", category:"Backend", level:"intermediate", hoursTotal:45
3. id:"sk3", name:"Docker", category:"DevOps", level:"beginner", hoursTotal:10

ProgressEntries (assume date = recent past for "this week" logic — use a fixed week reference):
1. id:"p1", skillId:"sk1", date:"2024-03-11", hoursLogged:2, notes:"Hooks review"
2. id:"p2", skillId:"sk2", date:"2024-03-12", hoursLogged:3, notes:"Goroutines"
3. id:"p3", skillId:"sk1", date:"2024-03-10", hoursLogged:1, notes:"Context API"

Resources:
1. id:"r1", skillId:"sk1", title:"React Docs", url:"https://react.dev", type:"article", completed:true
2. id:"r2", skillId:"sk2", title:"Go Tour", url:"https://tour.golang.org", type:"course", completed:false
3. id:"r3", skillId:"sk3", title:"Docker Tutorial", url:"https://docs.docker.com", type:"article", completed:false

## Behaviors

### Dashboard
- `data-testid="skill-count"` — total skills
- `data-testid="hours-this-week"` — sum hoursLogged from all progress entries (use all for dashboard simplicity)
- `data-testid="advanced-count"` — skills where level="advanced"

### Skills (`/skills`)
- `data-testid="skill-item"` per skill with name, category, level, hoursTotal
- `data-testid="level-select"` per skill to update level
- Category filter `data-testid="category-filter"` dropdown
- Add skill form: name, category, level select

### Progress (`/progress`)
- `data-testid="progress-item"` per entry with date, hours, notes, skill name
- Filter by skill: `data-testid="skill-filter"` dropdown
- Add entry: select skill, date, hoursLogged, notes; updates skill.hoursTotal

### Resources (`/resources`)
- `data-testid="resource-item"` with title, type, skill name, completed checkbox
- `data-testid="resource-complete"` checkbox per resource
- Filter by type: `data-testid="type-filter"` dropdown
- Add resource: select skill, title, url, type select

## API
`GET /api/skills` — all skills
`POST /api/skills` — body {name, category, level} creates skill with hoursTotal:0

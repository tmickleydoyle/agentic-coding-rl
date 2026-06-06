# scratch-app-career-goals

## Overview
A career goals tracker app for managing career objectives, job applications, and skill development milestones.

## Routes
- `/` — Dashboard: active goals count, pending applications, milestone completion %
- `/milestones` — Career milestones with target dates and completion status
- `/applications` — Job application tracker with status pipeline
- `/skills` — Skills needed for career goals with proficiency levels

## Data Model

### CareerGoal (global context, but stored in milestones)
### Milestone
```ts
interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string; // YYYY-MM-DD
  completed: boolean;
  category: "education" | "experience" | "skill" | "network";
}
```

### Application
```ts
interface Application {
  id: string;
  company: string;
  role: string;
  appliedDate: string;
  status: "applied" | "interview" | "offer" | "rejected" | "withdrawn";
  notes: string;
}
```

### CareerSkill
```ts
interface CareerSkill {
  id: string;
  name: string;
  proficiency: "beginner" | "intermediate" | "advanced";
  required: boolean;
}
```

## Seed Data

Milestones:
1. id:"ml1", title:"Complete AWS Certification", description:"Pass Solutions Architect exam", targetDate:"2024-06-30", completed:false, category:"education"
2. id:"ml2", title:"Lead a Project", description:"Lead cross-functional team project", targetDate:"2024-09-01", completed:false, category:"experience"
3. id:"ml3", title:"Build Portfolio", description:"3 public GitHub projects", targetDate:"2024-03-01", completed:true, category:"skill"

Applications:
1. id:"a1", company:"TechGiant", role:"Senior Engineer", appliedDate:"2024-02-01", status:"interview", notes:"Second round scheduled"
2. id:"a2", company:"StartupX", role:"Staff Engineer", appliedDate:"2024-02-15", status:"applied", notes:""
3. id:"a3", company:"OldCorp", role:"Lead Dev", appliedDate:"2024-01-10", status:"rejected", notes:"Salary mismatch"

CareerSkills:
1. id:"sk1", name:"Kubernetes", proficiency:"beginner", required:true
2. id:"sk2", name:"System Design", proficiency:"intermediate", required:true
3. id:"sk3", name:"TypeScript", proficiency:"advanced", required:false

## Behaviors

### Dashboard
- `data-testid="active-milestones"` — count of incomplete milestones
- `data-testid="pending-applications"` — count of applied or interview status
- `data-testid="milestone-pct"` — "X%" where X = completed/total*100 rounded

### Milestones (`/milestones`)
- `data-testid="milestone-item"` per milestone with title, category, targetDate
- `data-testid="milestone-complete"` checkbox to toggle completion
- Filter by category: `data-testid="category-filter"` dropdown (All + categories)
- Add form: title, description, targetDate, category select

### Applications (`/applications`)
- `data-testid="application-item"` with company, role, status badge
- Status update `data-testid="status-select"` per application
- Filter by status: `data-testid="status-filter"` — "All", "applied", "interview", "offer", "rejected"
- Add form: company, role, notes

### Skills (`/skills`)
- `data-testid="skill-item"` with name, proficiency, required badge
- `data-testid="proficiency-select"` to update proficiency per skill
- Filter `data-testid="required-filter"` — "All" / "Required" / "Optional"
- Add form: name, proficiency, required checkbox

## API
`GET /api/goals` — returns {milestones, applications, skills}
`POST /api/goals` — body {type:"milestone"|"application"|"skill", data:{...}} creates item

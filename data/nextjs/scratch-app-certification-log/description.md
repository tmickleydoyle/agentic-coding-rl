# scratch-app-certification-log

## Overview
A certification tracking app for managing professional certifications, study plans, and exam history.

## Routes
- `/` — Dashboard: total certifications (earned), in-progress count, next exam date
- `/certifications` — All certifications with status and expiry
- `/study` — Study plan entries: topics, time spent, linked to certifications
- `/exams` — Exam attempt history with scores

## Data Model

### Certification
```ts
interface Certification {
  id: string;
  name: string;
  provider: string;
  status: "planned" | "studying" | "earned" | "expired";
  earnedDate: string; // empty if not earned
  expiryDate: string; // empty if no expiry
  credentialId: string;
}
```

### StudyEntry
```ts
interface StudyEntry {
  id: string;
  certId: string;
  topic: string;
  hoursSpent: number;
  date: string;
}
```

### ExamAttempt
```ts
interface ExamAttempt {
  id: string;
  certId: string;
  date: string;
  score: number; // 0-100
  passed: boolean;
  notes: string;
}
```

## Seed Data

Certifications:
1. id:"cert1", name:"AWS Solutions Architect", provider:"Amazon", status:"earned", earnedDate:"2023-06-15", expiryDate:"2026-06-15", credentialId:"AWS-12345"
2. id:"cert2", name:"Kubernetes CKA", provider:"CNCF", status:"studying", earnedDate:"", expiryDate:"", credentialId:""
3. id:"cert3", name:"Google Cloud Professional", provider:"Google", status:"planned", earnedDate:"", expiryDate:"", credentialId:""

StudyEntries:
1. id:"st1", certId:"cert2", topic:"Cluster Architecture", hoursSpent:3, date:"2024-03-10"
2. id:"st2", certId:"cert2", topic:"Networking", hoursSpent:2, date:"2024-03-12"

ExamAttempts:
1. id:"ex1", certId:"cert1", date:"2023-06-15", score:85, passed:true, notes:"First attempt"
2. id:"ex2", certId:"cert2", date:"2024-01-20", score:60, passed:false, notes:"Need more practice"

## Behaviors

### Dashboard
- `data-testid="earned-count"` — certifications with status="earned"
- `data-testid="inprogress-count"` — certifications with status="studying"
- `data-testid="next-exam"` — "None scheduled" or next upcoming exam date

### Certifications (`/certifications`)
- `data-testid="cert-item"` per certification with name, provider, status badge
- `data-testid="status-badge"` showing current status
- Filter by status: `data-testid="status-filter"` dropdown
- Add form: name, provider, status select
- Delete removes cert and its study/exam records

### Study (`/study`)
- `data-testid="study-item"` with topic, hours, date, cert name
- Total hours per cert shown: `data-testid="total-hours"`
- Filter by cert: `data-testid="cert-filter"` dropdown
- Add entry: select cert, topic, hoursSpent, date

### Exams (`/exams`)
- `data-testid="exam-item"` with date, score, passed/failed badge, cert name
- `data-testid="pass-badge"` or `data-testid="fail-badge"` per result
- Filter: `data-testid="filter-passed"` / `data-testid="filter-failed"` / `data-testid="filter-all"`
- Add exam attempt: select cert, date, score (auto-compute passed if score >= 70)

## API
`GET /api/certifications` — all certifications
`POST /api/certifications` — body {name, provider, status} creates certification

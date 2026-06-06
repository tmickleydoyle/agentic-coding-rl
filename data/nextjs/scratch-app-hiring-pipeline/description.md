# scratch-app-hiring-pipeline

A hiring pipeline tracker for startups to manage job openings, candidates, and interview stages.

## Routes
- `/` — Dashboard: open roles count, candidates by stage, recent activity
- `/jobs` — List/add/close job openings. Fields: title, department (Engineering/Design/Marketing/Sales/Operations), status (Open/Closed)
- `/candidates` — List/add/update candidates. Fields: name, email, jobId, stage (Applied/Phone Screen/Technical/Onsite/Offer/Hired/Rejected)
- `/interviews` — Schedule/log interviews. Fields: candidateId, type (Phone/Technical/Onsite/Final), scheduledDate, notes, result (Pending/Pass/Fail)

## Seed Data
Jobs:
1. { id: "1", title: "Senior Engineer", department: "Engineering", status: "Open" }
2. { id: "2", title: "Product Designer", department: "Design", status: "Open" }
3. { id: "3", title: "Growth Marketer", department: "Marketing", status: "Closed" }

Candidates:
1. { id: "1", name: "Alice Smith", email: "alice@mail.com", jobId: "1", stage: "Technical" }
2. { id: "2", name: "Bob Jones", email: "bob@mail.com", jobId: "1", stage: "Phone Screen" }
3. { id: "3", name: "Carol Lee", email: "carol@mail.com", jobId: "2", stage: "Applied" }
4. { id: "4", name: "Dan Park", email: "dan@mail.com", jobId: "1", stage: "Hired" }

Interviews:
1. { id: "1", candidateId: "1", type: "Technical", scheduledDate: "2024-02-10", notes: "Strong performance", result: "Pass" }

## Behaviors
- Dashboard shows: open roles count, breakdown of candidates by stage
- Candidates page shows job title (looked up from jobs)
- Adding candidate requires name, email (with @), and jobId selection
- Moving a candidate to Hired marks that role's pipeline count +1
- Closing a job: candidates linked to it remain but job shows as Closed
- Interviews show candidate name
- Result options: Pending/Pass/Fail

## Edge Cases
- Email validation: must contain "@"
- Cannot add candidate to a Closed job (show error)
- Stage changes reflected in dashboard immediately

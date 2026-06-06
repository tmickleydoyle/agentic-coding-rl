# Certificate Tracker App

Build a multi-route certificate tracking app with four views: Home, Certificates, Skills, and Issued.

## Seed Data
- Skills: [
    { id: 1, name: "JavaScript", category: "Programming", requiredHours: 40 },
    { id: 2, name: "Python", category: "Programming", requiredHours: 40 },
    { id: 3, name: "Public Speaking", category: "Soft Skills", requiredHours: 20 },
    { id: 4, name: "Data Analysis", category: "Analytics", requiredHours: 60 }
  ]
- Certificates: [
    { id: 1, skillId: 1, recipientName: "Alice Johnson", issuedDate: "2024-01-10", hoursCompleted: 45 },
    { id: 2, skillId: 3, recipientName: "Bob Martinez", issuedDate: "2024-01-12", hoursCompleted: 22 }
  ]
- Learners: [
    { id: 1, name: "Alice Johnson", skillId: 1, hoursLogged: 45 },
    { id: 2, name: "Bob Martinez", skillId: 3, hoursLogged: 22 },
    { id: 3, name: "Carol White", skillId: 2, hoursLogged: 15 }
  ]

## Routes / Pages
- **Home** (`home`): Shows "Certificate Tracker" title. Total certificates issued. Total skills offered. Buttons: "View Certificates" → certificates, "Manage Skills" → skills.
- **Certificates** (`certificates`): Lists issued certificates. Each row: recipient name, skill name, issued date, hours. "Issue Certificate" button opens inline form: skill select, recipient name input, hours input, date input, "Issue" submit. Validates hours >= skill's requiredHours (show error otherwise).
- **Skills** (`skills`): Lists skills with name, category, required hours. Form to add skill (name, category, requiredHours inputs + "Add Skill"). Each skill has a delete button (only if no certificates issued for it).
- **Issued** (`issued`): Shows certificate count per skill. Each row: skill name, certificate count. Also shows total unique recipients. Filter by category dropdown ("All" + categories).

## Behaviors
- GET `/api/certificates` → `{ skills, certificates }`
- POST `/api/certificates?type=skill` with `{ name, category, requiredHours }` → add skill
- DELETE `/api/certificates?type=skill` with `{ id }` → delete skill (400 if certificates exist for it)
- POST `/api/certificates?type=certificate` with `{ skillId, recipientName, issuedDate, hoursCompleted }` → issue certificate
- Hours must be >= skill's requiredHours (400 if not).

## Fields
- Skill: `{ id: number, name: string, category: string, requiredHours: number }`
- Certificate: `{ id: number, skillId: number, recipientName: string, issuedDate: string, hoursCompleted: number }`

## Edge Cases
- Cannot delete skill with existing certificates.
- Hours < requiredHours returns 400 with "Insufficient hours" message.
- Issued page category filter shows only matching skills.

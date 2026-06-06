# Neighborhood App

A neighborhood management app with Directory, Issues, Announcements, and REST API.

## Routes
- `/` — Shell
- `/directory` — resident directory (name, address, phone, move-in year), add resident form
- `/issues` — neighborhood issues (title, category: Safety/Maintenance/Noise/Other, status: Open/In Progress/Resolved, reporter, date), update status
- `/announcements` — announcements (title, body, author, date, pinned boolean), pin/unpin toggle

## Data / Seed
### Residents
```
{ id: "res1", name: "Alice Johnson", address: "12 Oak St", phone: "555-0101", moveIn: 2018 }
{ id: "res2", name: "Bob Kim", address: "14 Oak St", phone: "555-0102", moveIn: 2020 }
{ id: "res3", name: "Carol Davis", address: "16 Oak St", phone: "555-0103", moveIn: 2015 }
```

### Issues
```
{ id: "i1", title: "Broken streetlight", category: "Maintenance", status: "Open", reporter: "Alice Johnson", date: "2024-05-10" }
{ id: "i2", title: "Speeding cars", category: "Safety", status: "In Progress", reporter: "Bob Kim", date: "2024-05-15" }
{ id: "i3", title: "Loud parties", category: "Noise", status: "Resolved", reporter: "Carol Davis", date: "2024-05-20" }
```

### Announcements
```
{ id: "ann1", title: "Road closure next week", body: "Main St will be closed Mon-Wed.", author: "Admin", date: "2024-06-01", pinned: true }
{ id: "ann2", title: "New playground open", body: "The playground on Oak St is now open.", author: "Admin", date: "2024-06-05", pinned: false }
```

## Behaviors
- Directory: add resident form with name, address, phone, move-in year
- Issues: dropdown to change status per issue (Open / In Progress / Resolved)
- Announcements: "Pin" / "Unpin" toggle button; pinned announcements show a "Pinned" badge
- API GET /api/neighbors returns all residents
- API POST /api/neighbors adds a resident

## Edge Cases
- Directory: name required to add
- Issues: status badge color-coded by text (just text label is enough)
- Announcements pinned sorted first (pinned items appear before unpinned)

# scratch-app-study-group

A study group platform where students can create groups by subject, manage membership, and log study sessions.

## Routes
- **Home** (`home`): Dashboard with counts of groups, members, sessions.
- **Groups** (`groups`): List all groups (name, subject, format, member count/max); add new group; delete group.
- **Members** (`members`): List members; add member; join a group (blocked if full or already member).
- **Sessions** (`sessions`): Log study sessions per group with topic, date, duration, format.

## Seed Data
- Groups: Calculus Crew (Math, online, max 6, members m1+m2), History Buffs (History, in-person, max 8, member m1), Code Club (CS, hybrid, max 10, members m2+m3)
- Members: Alice Johnson, Bob Smith, Carol Lee
- Sessions: Derivatives with Calculus Crew (2024-03-05, 60min), Binary Trees with Code Club (2024-03-07, 90min)

## Behaviors
- Adding group requires name; maxMembers must be >= 2
- Adding member requires name and email
- Joining group fails if group is full or member already in group
- Session requires all fields; duration must be positive integer
- Deleting a group removes it from the list

## API (app/api/groups/route.ts)
- GET /api/groups — returns all groups
- POST /api/groups — creates group (name, subject, description, maxMembers, meetingFormat); 400 if missing or maxMembers < 2
- DELETE /api/groups?id=<id> — 404 if not found

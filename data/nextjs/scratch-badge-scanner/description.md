# Badge Scanner

A conference badge check-in simulator. Attendees enter a badge ID to check into a session, and the app tracks attendance.

## Seed Data

### Sessions (3 pre-loaded)

| id | name | room | capacity |
|----|------|------|----------|
| "s1" | "React Patterns in 2025" | "Room A" | 3 |
| "s2" | "Scaling Microservices" | "Room B" | 4 |
| "s3" | "Designing for Accessibility" | "Room C" | 3 |

### Attendees (6 pre-loaded, all checked-out initially)

| badgeId | name |
|---------|------|
| "A001" | "Alice Tran" |
| "A002" | "Ben Okafor" |
| "A003" | "Cara White" |
| "A004" | "David Kim" |
| "A005" | "Eva Russo" |
| "A006" | "Frank Liu" |

## Behaviors

### Session Selector
- A dropdown (select) to choose the active session
- Default: first session selected
- Switching session updates the check-in list shown below

### Check-In
- A text input labelled "Badge ID" and a "Check In" button
- Entering a valid badge ID and clicking "Check In":
  - Adds the attendee to the checked-in list for that session
  - Shows the attendee's name alongside their badge ID in the list
- If badge ID is unknown: show error message "Unknown badge ID"
- If attendee is already checked in to this session: show error message "Already checked in"
- If session is at capacity: show error message "Session is full"
- Error messages clear when the input changes
- Input clears after successful check-in

### Check-Out
- Each checked-in attendee row has a "Check Out" button
- Clicking it removes them from the checked-in list for that session (frees a spot)

### Attendance Display
- Show "X / Y checked in" where X = current attendance, Y = capacity for the active session
- List of checked-in attendees with badge ID and name

### Session Summary
- At the bottom, show a summary table of all sessions with columns: Session Name, Room, Checked In, Capacity

## Edge Cases
- Checking out and re-checking in the same attendee is allowed
- Switching sessions does not clear check-in data for the previous session
- Badge ID input is case-sensitive (A001 != a001)

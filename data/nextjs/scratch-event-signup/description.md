# Event Signup

## Overview
A single-page React app to sign up volunteers for community events with capacity management.

## Seed Data

### Events
| ID | Name                    | Date       | Location          | Capacity |
|----|-------------------------|------------|-------------------|----------|
| 1  | Park Cleanup Day        | 2024-04-06 | Central Park      | 20       |
| 2  | Food Bank Volunteer     | 2024-04-13 | Community Center  | 15       |
| 3  | Beach Cleanup           | 2024-04-20 | Sunset Beach      | 30       |

### Signups
| ID | Event ID | Volunteer Name | Email                  |
|----|----------|----------------|------------------------|
| 1  | 1        | Alice Johnson  | alice@example.com      |
| 2  | 1        | Bob Smith      | bob@example.com        |
| 3  | 2        | Carol Davis    | carol@example.com      |

## Fields

### Add Event Form
- **Event Name** (text input)
- **Date** (date input)
- **Location** (text input)
- **Capacity** (number input, min 1, step 1): max number of volunteers
- "Add Event" button

### Signup Form
- **Select Event** (select dropdown listing all event names with available spots)
- **Volunteer Name** (text input)
- **Email** (email input)
- "Sign Up" button

## Behaviors

### Events List
- Display each event as a card showing:
  - Event name, date, location
  - Spots filled: "X / Y" where X is signed-up count, Y is capacity
  - List of signed-up volunteers (name + email) under each event
  - "Full" badge (data-testid="full-badge-{id}") when spots filled equals capacity
  - "Cancel Event" button to delete the event and all its signups
- Show "No events scheduled." if empty.

### Add Event
- Validate: name not empty, date filled, location not empty, capacity >= 1. If invalid, do nothing.
- Append new event to end of list.
- Clear form after submit.

### Sign Up
- The "Select Event" dropdown only lists events that are NOT full (spots filled < capacity).
- Validate: event selected, name not empty, email contains "@". If invalid, do nothing.
- Duplicate email per event: if the email is already signed up for that event, do not add.
- Add signup under the selected event.
- Clear form after submit.
- If event becomes full after signup, remove it from the dropdown.

### Summary
- "Total Events:" — count of all events.
- "Total Signups:" — count of all signups across all events.
- "Available Spots:" — sum of (capacity - filled) across all events.

## Edge Cases
- Full events do not appear in the signup dropdown.
- Duplicate email for same event: silently reject.
- Cancelling an event reduces Total Signups and Total Events in summary.
- Capacity of 0 is invalid (min 1).
- Available Spots updates immediately when a signup is added or event is cancelled.

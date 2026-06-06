# scratch-app-networking-log

## Overview
A networking event log app to track professional events attended, connections made at each event, and follow-up actions needed.

## Routes
- `/` — Dashboard: total events, total connections, pending follow-ups count
- `/events` — List of networking events with add/delete
- `/connections` — All connections across events, filterable by event
- `/followups` — Follow-up tasks: pending and completed

## Data Model

### Event
```ts
interface NetworkEvent {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  location: string;
  type: "conference" | "meetup" | "workshop" | "other";
}
```

### Connection
```ts
interface Connection {
  id: string;
  eventId: string;
  name: string;
  role: string;
  company: string;
  email: string;
}
```

### FollowUp
```ts
interface FollowUp {
  id: string;
  connectionId: string;
  connectionName: string;
  action: string;
  done: boolean;
  createdAt: string;
}
```

## Seed Data

Events:
1. id:"e1", name:"ReactConf 2024", date:"2024-05-15", location:"Las Vegas", type:"conference"
2. id:"e2", name:"Local JS Meetup", date:"2024-06-01", location:"San Francisco", type:"meetup"

Connections:
1. id:"con1", eventId:"e1", name:"Sara Lee", role:"Engineer", company:"TechCorp", email:"sara@tech.com"
2. id:"con2", eventId:"e1", name:"Mike Tan", role:"PM", company:"StartupXY", email:"mike@xy.com"
3. id:"con3", eventId:"e2", name:"Jo Park", role:"Designer", company:"DesignCo", email:"jo@design.com"

FollowUps:
1. id:"f1", connectionId:"con1", connectionName:"Sara Lee", action:"Send portfolio", done:false, createdAt:"2024-05-16"
2. id:"f2", connectionId:"con2", connectionName:"Mike Tan", action:"Schedule coffee", done:true, createdAt:"2024-05-17"

## Behaviors

### Dashboard
- `data-testid="event-count"` total events
- `data-testid="connection-count"` total connections
- `data-testid="pending-followups"` count of followups where done=false

### Events (`/events`)
- Lists events: `data-testid="event-item"` with name, date, type, location
- Add form: name, date, location, type select; submit adds event
- Delete button removes event and all its connections

### Connections (`/connections`)
- `data-testid="connection-item"` per connection with name, role, company
- Dropdown `data-testid="event-filter"` — "All" or specific event name
- Add connection form: select event, name, role, company, email

### FollowUps (`/followups`)
- `data-testid="followup-item"` per followup; show action and connectionName
- Checkbox `data-testid="followup-done"` to toggle done status
- Filter tabs: "All", "Pending", "Done" — `data-testid="filter-all"`, `data-testid="filter-pending"`, `data-testid="filter-done"`

## API Route
`GET /api/events` — returns all events
`POST /api/events` — body {name,date,location,type} creates event, returns it

## Edge Cases
- Deleting an event removes its connections from the connections list
- Pending followups count updates when toggleing done status

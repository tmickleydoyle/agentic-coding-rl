# scratch-app-analytics-log

A web analytics logging tool to track events, compute funnels, and define user segments.

## Routes
- `/` — Overview: summary stats (total events, unique sessions, top event names, date range)
- `/events` — Events: log list with filtering by event name and date; add custom events
- `/funnels` — Funnels: define multi-step funnels and compute conversion rates from event data
- `/segments` — Segments: define user segments by filter criteria (event name, min occurrences)

## Data model
### EventLog
```ts
{ id: string; name: string; sessionId: string; properties: Record<string, string>; timestamp: string; createdAt: number }
```
### Funnel
```ts
{ id: string; name: string; steps: string[]; createdAt: number }
```
### Segment
```ts
{ id: string; name: string; eventName: string; minOccurrences: number; createdAt: number }
```

## Seed data
Events (10 entries):
- "page_view" x4 (sessions: s1,s2,s3,s4, timestamps on 2030-06-01)
- "signup" x2 (sessions: s1,s2, timestamps 2030-06-01)
- "purchase" x1 (session: s1, timestamp 2030-06-01)
- "page_view" x3 more (sessions: s5,s6,s7, timestamps 2030-06-02)

Funnels: ["Signup Flow" (steps: ["page_view","signup","purchase"])]
Segments: ["Buyers" (eventName: "purchase", minOccurrences: 1)]

## Behaviors
- Overview: total events, unique sessions (distinct sessionIds), top 3 event names by count
- Events page: filter by event name (text input); add event requires name and sessionId
- Funnels: show each step and count of sessions that reached that step
- Segments: count matching sessions for each segment
- NavBar highlights active route

## Edge cases
- Empty events list shows "No events logged"
- Empty funnels shows "No funnels defined"

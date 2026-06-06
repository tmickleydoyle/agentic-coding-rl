# scratch-app-speaker-tracker

## Overview
A speaker tracking app for monitoring public speakers, their talks, and events they participate in. Useful for event organizers or attendees who follow specific speakers.

## Routes
- `/` — Dashboard: total speakers, total talks watched, upcoming events count
- `/speakers` — Speaker profiles with follow/unfollow
- `/talks` — All talks by tracked speakers with ratings and notes
- `/events` — Upcoming speaking events with RSVP tracking

## Data Model

### Speaker
```ts
interface Speaker {
  id: string;
  name: string;
  expertise: string[];
  bio: string;
  following: boolean;
}
```

### TalkRecord
```ts
interface TalkRecord {
  id: string;
  speakerId: string;
  title: string;
  eventName: string;
  watchedDate: string; // YYYY-MM-DD or empty if not watched
  watched: boolean;
  rating: number; // 0 if not rated, 1-5
  notes: string;
}
```

### SpeakingEvent
```ts
interface SpeakingEvent {
  id: string;
  speakerId: string;
  eventName: string;
  date: string; // YYYY-MM-DD
  location: string;
  rsvped: boolean;
}
```

## Seed Data

Speakers:
1. id:"sp1", name:"Sarah Chen", expertise:["AI","MLOps"], bio:"ML engineer at BigCo", following:true
2. id:"sp2", name:"Marcus Johnson", expertise:["Security","DevOps"], bio:"Security researcher", following:true
3. id:"sp3", name:"Priya Sharma", expertise:["Frontend","React"], bio:"Staff engineer at StartupY", following:false

TalkRecords:
1. id:"tr1", speakerId:"sp1", title:"Production ML Systems", eventName:"MLConf 2024", watchedDate:"2024-02-10", watched:true, rating:5, notes:"Excellent content on monitoring"
2. id:"tr2", speakerId:"sp2", title:"Zero Trust Architecture", eventName:"SecureCon", watchedDate:"", watched:false, rating:0, notes:""
3. id:"tr3", speakerId:"sp1", title:"Feature Store Design", eventName:"DataSummit", watchedDate:"2024-03-05", watched:true, rating:4, notes:"Good practical advice"

SpeakingEvents:
1. id:"ev1", speakerId:"sp1", eventName:"AI World 2024", date:"2024-08-20", location:"NYC", rsvped:true
2. id:"ev2", speakerId:"sp3", eventName:"React Summit", date:"2024-09-15", location:"Amsterdam", rsvped:false

## Behaviors

### Dashboard
- `data-testid="speaker-count"` — total speakers
- `data-testid="watched-count"` — talks where watched=true
- `data-testid="upcoming-events"` — total speaking events count

### Speakers (`/speakers`)
- `data-testid="speaker-item"` with name, bio, expertise tags
- `data-testid="follow-btn"` toggles following status; label changes to "Unfollow" if following
- Filter: `data-testid="following-filter"` checkbox to show only followed speakers
- Add speaker form: name, expertise (comma-separated), bio

### Talks (`/talks`)
- `data-testid="talk-item"` with title, eventName, speaker name, watched badge if watched
- `data-testid="mark-watched"` button to mark as watched (sets watched=true, watchedDate=today)
- `data-testid="rating-select"` to set rating 1-5 for watched talks
- Filter by speaker: `data-testid="speaker-filter"` dropdown
- Filter: show only unwatched `data-testid="filter-unwatched"` button

### Events (`/events`)
- `data-testid="event-item"` with eventName, date, location, speaker name
- `data-testid="rsvp-btn"` toggles RSVP status
- `data-testid="rsvped-badge"` shown when rsvped=true
- Add event form: select speaker, eventName, date, location

## API
`GET /api/speakers` — all speakers
`POST /api/speakers` — body {name, expertise:string[], bio} creates speaker (following:false)

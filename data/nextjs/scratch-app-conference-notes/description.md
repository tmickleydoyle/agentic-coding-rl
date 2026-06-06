# scratch-app-conference-notes

## Overview
A conference notes app for capturing notes from conferences, talks, and speakers with tagging and search.

## Routes
- `/` — Dashboard: total conferences, total talks, total notes (note count)
- `/conferences` — Conference list with add/delete
- `/talks` — Talks list with notes, filterable by conference
- `/speakers` — Speaker list with bio and linked talks

## Data Model

### Conference
```ts
interface Conference {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  location: string;
  attended: boolean;
}
```

### Talk
```ts
interface Talk {
  id: string;
  conferenceId: string;
  speakerId: string;
  title: string;
  notes: string;
  tags: string[];
  rating: number; // 1-5
}
```

### Speaker
```ts
interface Speaker {
  id: string;
  name: string;
  bio: string;
  twitter: string;
}
```

## Seed Data

Conferences:
1. id:"conf1", name:"ReactConf 2024", date:"2024-05-15", location:"Las Vegas", attended:true
2. id:"conf2", name:"Node Summit", date:"2024-07-10", location:"San Francisco", attended:false

Speakers:
1. id:"sp1", name:"Dan Abramov", bio:"React core team", twitter:"@dan_abramov"
2. id:"sp2", name:"Evan You", bio:"Creator of Vue.js", twitter:"@youyuxi"
3. id:"sp3", name:"Ryan Dahl", bio:"Creator of Node.js and Deno", twitter:"@rough_sea"

Talks:
1. id:"t1", conferenceId:"conf1", speakerId:"sp1", title:"React Server Components Deep Dive", notes:"Key insight: streaming", tags:["react","server"], rating:5
2. id:"t2", conferenceId:"conf1", speakerId:"sp2", title:"Vite 5 Performance", notes:"New bundler improvements", tags:["vite","performance"], rating:4
3. id:"t3", conferenceId:"conf2", speakerId:"sp3", title:"Deno 2.0 Updates", notes:"Node compat layer ready", tags:["deno","node"], rating:4

## Behaviors

### Dashboard
- `data-testid="conference-count"` — total conferences
- `data-testid="talk-count"` — total talks
- `data-testid="speaker-count"` — total speakers

### Conferences (`/conferences`)
- `data-testid="conference-item"` per conference with name, date, location
- Attended badge `data-testid="attended-badge"` when attended=true
- Toggle attended: `data-testid="toggle-attended"` button
- Add form: name, date, location; delete removes conference and its talks

### Talks (`/talks`)
- `data-testid="talk-item"` with title, rating stars display, tags, speaker name
- Filter by conference: `data-testid="conference-filter"` dropdown
- Search by title/tags: `data-testid="search-input"`
- Add talk form: select conference, select speaker, title, notes, rating

### Speakers (`/speakers`)
- `data-testid="speaker-item"` with name, bio, twitter
- `data-testid="speaker-talk-count"` number of talks per speaker
- Add speaker form: name, bio, twitter

## API
`GET /api/conferences` — all conferences
`POST /api/conferences` — body {name, date, location} creates conference (attended:false)

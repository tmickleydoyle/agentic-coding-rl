# Music Library

A music library management app for browsing tracks, artists, and managing a play queue.

## Routes
- `/` → Home: total tracks, total artists, total queue items
- `/library` → Library: all tracks with title, artist, album, duration; add new track form
- `/artists` → Artists: unique artists derived from tracks; click to see their tracks
- `/queue` → Queue: tracks added to queue; add/remove from queue

## Data Model

### Track
```ts
interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number  // seconds
}
```

### QueueItem
```ts
interface QueueItem {
  id: string
  trackId: string
}
```

## Seed Data
Tracks:
- { id: "t1", title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", duration: 354 }
- { id: "t2", title: "Under Pressure", artist: "Queen", album: "Hot Space", duration: 248 }
- { id: "t3", title: "Heroes", artist: "David Bowie", album: "Heroes", duration: 370 }
- { id: "t4", title: "Let's Dance", artist: "David Bowie", album: "Let's Dance", duration: 458 }
- { id: "t5", title: "Roxanne", artist: "The Police", album: "Outlandos d'Amour", duration: 190 }

Queue:
- { id: "q1", trackId: "t1" }
- { id: "q2", trackId: "t3" }

## Behaviors

### Home Page
- data-testid="total-tracks": count of all tracks (5)
- data-testid="total-artists": count of unique artists (3)
- data-testid="queue-count": count of items in queue (2)

### Library Page
- Each track: data-testid="track-item-{id}"
- Shows title, artist, album, duration (seconds)
- "Add to Queue" button: data-testid="add-queue-{id}"
- Add track form: title, artist, album, duration (number)
- Submit: data-testid="add-track-btn"

### Artists Page
- Each unique artist: data-testid="artist-item-{name}" (use artist name, spaces replaced with hyphens)
- Shows artist name and track count
- data-testid format: "artist-item-Queen", "artist-item-David-Bowie", "artist-item-The-Police"

### Queue Page
- Each queue item: data-testid="queue-item-{id}"
- Shows track title
- Remove button: data-testid="remove-queue-{id}"

## API Routes
- GET /api/music → { tracks: Track[] }
- POST /api/music → body { title, artist, album, duration } → created Track
- GET /api/music/queue → { queue: QueueItem[] }
- POST /api/music/queue → body { trackId } → created QueueItem
- DELETE /api/music/queue?id={id} → removes QueueItem, returns { success: true }

## Edge Cases
- Adding track with missing title returns 400
- "Add to Queue" from library page adds to queue and queue count updates on home
- Remove from queue updates home queue count immediately

# scratch-app-travel-journal

## Overview
A multi-route travel journal app where users can write journal entries about their trips, view all entries, and see statistics about their travels.

## Routes
- `/` — Home: welcome screen with quick stats summary and navigation links
- `/journal` — Journal list: shows all entries sorted by date descending
- `/new-entry` — New Entry form: add a new journal entry
- `/stats` — Stats: aggregate statistics about all entries

## Data Model (JournalEntry)
```ts
interface JournalEntry {
  id: string;
  title: string;
  country: string;
  city: string;
  date: string;         // ISO date string "YYYY-MM-DD"
  mood: "happy" | "neutral" | "sad";
  body: string;
  rating: number;       // 1-5
}
```

## Seed Data (pre-loaded in store)
```ts
[
  { id: "1", title: "Arrival in Tokyo", country: "Japan", city: "Tokyo", date: "2024-03-15", mood: "happy", body: "Amazing first day!", rating: 5 },
  { id: "2", title: "Lost in Kyoto", country: "Japan", city: "Kyoto", date: "2024-03-18", mood: "happy", body: "Found hidden temples.", rating: 4 },
  { id: "3", title: "Rainy Rome", country: "Italy", city: "Rome", date: "2024-05-02", mood: "neutral", body: "Saw the Colosseum despite rain.", rating: 3 },
]
```

## Behaviors

### Home (`/`)
- Displays heading "Travel Journal"
- Shows total entry count (data-testid="home-entry-count")
- Shows number of countries visited (data-testid="home-country-count")
- Nav links to /journal, /new-entry, /stats

### Journal List (`/journal`)
- Lists all entries; each entry shows title, city, country, date, mood, rating
- data-testid="entry-card" on each card
- data-testid="entry-title", "entry-country", "entry-rating" within each card
- Empty state: "No entries yet" when list is empty

### New Entry (`/new-entry`)
- Form fields: title (text), country (text), city (text), date (date), mood (select: happy/neutral/sad), body (textarea), rating (number 1-5)
- Submit button data-testid="submit-entry"
- On submit: POST to /api/entries, navigate to /journal
- Validation: all fields required; rating must be 1-5

### Stats (`/stats`)
- data-testid="stat-total-entries" — total count
- data-testid="stat-countries" — comma-separated sorted list of unique countries
- data-testid="stat-avg-rating" — average rating rounded to 1 decimal
- data-testid="stat-top-mood" — most frequent mood

## API Route: /api/entries
- GET: returns JSON array of all entries
- POST: accepts { title, country, city, date, mood, body, rating }, creates entry with generated id, returns 201 + created entry

## Edge Cases
- Adding entry increments home count
- Duplicate countries counted once in stats
- Average rating with no entries shows "N/A"

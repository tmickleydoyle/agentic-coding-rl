# scratch-app-hostel-reviews

## Overview
A hostel review app for backpackers to log reviews of hostels visited during travels, with rating aggregation and a top-rated view.

## Routes
- `/` — Home: title, total reviews, average overall rating
- `/reviews` — All reviews list
- `/add-review` — Form to add a new review
- `/top-rated` — Top rated hostels (rating >= 4), sorted descending by rating

## Data Model (HostelReview)
```ts
interface HostelReview {
  id: string;
  hostelName: string;
  city: string;
  country: string;
  rating: number;       // 1-5
  cleanliness: number;  // 1-5
  location: number;     // 1-5
  value: number;        // 1-5
  date: string;         // "YYYY-MM-DD"
  comment: string;
}
```

## Seed Data
```ts
[
  { id: "1", hostelName: "Sakura Hostel", city: "Tokyo", country: "Japan", rating: 5, cleanliness: 5, location: 4, value: 5, date: "2024-03-15", comment: "Perfect!" },
  { id: "2", hostelName: "Casa Bella", city: "Rome", country: "Italy", rating: 4, cleanliness: 4, location: 5, value: 3, date: "2024-05-02", comment: "Great location." },
  { id: "3", hostelName: "Budget Inn", city: "Bangkok", country: "Thailand", rating: 2, cleanliness: 2, location: 3, value: 4, date: "2024-04-10", comment: "Not great." },
]
```

## Behaviors

### Home (`/`)
- Heading "Hostel Reviews"
- data-testid="home-review-count" — total count
- data-testid="home-avg-rating" — average rating to 1 decimal

### Reviews (`/reviews`)
- data-testid="review-card" per review
- data-testid="review-hostel", "review-city", "review-rating", "review-date", "review-comment"

### Add Review (`/add-review`)
- Fields: hostelName, city, country, rating (1-5), cleanliness (1-5), location (1-5), value (1-5), date, comment
- data-testid: input-hostel-name, input-city, input-country, input-rating, input-cleanliness, input-location, input-value, input-date, input-comment, submit-review
- On submit: adds review, navigates to /reviews

### Top Rated (`/top-rated`)
- data-testid="top-rated-page"
- Shows only reviews with rating >= 4
- Sorted by rating descending
- data-testid="top-card" per entry
- data-testid="top-hostel" and "top-rating" within each

## API: /api/reviews
- GET: all reviews
- POST: create review, return 201

## Edge Cases
- Rating must be 1-5 (validate in form, show error)
- Top-rated excludes rating < 4
- Average shown as "N/A" when no reviews

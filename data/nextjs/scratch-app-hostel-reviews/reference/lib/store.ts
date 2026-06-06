import type { HostelReview } from "./types";

const seed: HostelReview[] = [
  { id: "1", hostelName: "Sakura Hostel", city: "Tokyo", country: "Japan", rating: 5, cleanliness: 5, location: 4, value: 5, date: "2024-03-15", comment: "Perfect!" },
  { id: "2", hostelName: "Casa Bella", city: "Rome", country: "Italy", rating: 4, cleanliness: 4, location: 5, value: 3, date: "2024-05-02", comment: "Great location." },
  { id: "3", hostelName: "Budget Inn", city: "Bangkok", country: "Thailand", rating: 2, cleanliness: 2, location: 3, value: 4, date: "2024-04-10", comment: "Not great." },
];

let reviews: HostelReview[] = seed.map((r) => ({ ...r }));
let nextId = 4;

export function getReviews(): HostelReview[] {
  return reviews;
}

export function addReview(data: Omit<HostelReview, "id">): HostelReview {
  const review: HostelReview = { ...data, id: String(nextId++) };
  reviews.push(review);
  return review;
}

export function __reset(): void {
  reviews = seed.map((r) => ({ ...r }));
  nextId = 4;
}

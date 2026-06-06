import type { HostelReview } from "./types";

export function getReviews(): HostelReview[] {
  return [];
}

export function addReview(_data: Omit<HostelReview, "id">): HostelReview {
  return { id: "", hostelName: "", city: "", country: "", rating: 0, cleanliness: 0, location: 0, value: 0, date: "", comment: "" };
}

export function __reset(): void {}

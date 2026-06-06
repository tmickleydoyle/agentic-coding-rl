import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function TopRatedPage() {
  const { reviews } = useApp();
  const top = reviews.filter((r) => r.rating >= 4).sort((a, b) => b.rating - a.rating);
  return (
    <div data-testid="top-rated-page">
      <h2>Top Rated</h2>
      {top.map((r) => (
        <div key={r.id} data-testid="top-card">
          <span data-testid="top-hostel">{r.hostelName}</span>
          <span data-testid="top-rating">{r.rating}</span>
        </div>
      ))}
    </div>
  );
}

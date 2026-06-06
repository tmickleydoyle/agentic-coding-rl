import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";
import ReviewsPage from "./reviews/page";
import AddReviewPage from "./add-review/page";
import TopRatedPage from "./top-rated/page";

function Shell() {
  const { route, reviews } = useApp();
  const avgRating = reviews.length === 0 ? "N/A" : (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  let content: React.ReactNode;
  if (route === "/reviews") content = <ReviewsPage />;
  else if (route === "/add-review") content = <AddReviewPage />;
  else if (route === "/top-rated") content = <TopRatedPage />;
  else content = (
    <div data-testid="home-page">
      <h1>Hostel Reviews</h1>
      <p data-testid="home-review-count">{reviews.length}</p>
      <p data-testid="home-avg-rating">{avgRating}</p>
    </div>
  );

  return (
    <div>
      <NavBar />
      {content}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}

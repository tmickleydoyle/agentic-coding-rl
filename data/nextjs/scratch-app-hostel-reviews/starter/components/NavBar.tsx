import React from "react";

export default function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-reviews">Reviews</button>
      <button data-testid="nav-add-review">Add Review</button>
      <button data-testid="nav-top-rated">Top Rated</button>
    </nav>
  );
}

import React from "react";
import { useApp } from "./AppStateProvider";

export default function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button onClick={() => navigate("/")} data-testid="nav-home">Home</button>
      <button onClick={() => navigate("/reviews")} data-testid="nav-reviews">Reviews</button>
      <button onClick={() => navigate("/add-review")} data-testid="nav-add-review">Add Review</button>
      <button onClick={() => navigate("/top-rated")} data-testid="nav-top-rated">Top Rated</button>
    </nav>
  );
}

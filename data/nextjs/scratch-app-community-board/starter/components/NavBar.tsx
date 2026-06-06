import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-posts" onClick={() => navigate("posts")}>Posts</button>
      <button data-testid="nav-members" onClick={() => navigate("members")}>Members</button>
      <button data-testid="nav-events" onClick={() => navigate("events")}>Events</button>
    </nav>
  );
}

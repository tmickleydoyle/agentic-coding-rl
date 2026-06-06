import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import { PostsPage } from "./posts/page";
import { MembersPage } from "./members/page";
import { EventsPage } from "./events/page";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "posts" && <PostsPage />}
      {route === "members" && <MembersPage />}
      {route === "events" && <EventsPage />}
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

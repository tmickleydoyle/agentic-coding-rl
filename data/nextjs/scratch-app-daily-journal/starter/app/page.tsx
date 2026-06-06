import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "home" && (
        <div data-testid="home-page">
          <h1>Daily Journal</h1>
          <p data-testid="entry-count">Total entries: 0</p>
          <div data-testid="recent-entries" />
          <button data-testid="go-new-entry">Write Today</button>
        </div>
      )}
      {route === "entries" && (
        <div data-testid="entries-page">
          <h2>All Entries</h2>
          <ul data-testid="entries-list" />
        </div>
      )}
      {route === "new-entry" && (
        <div data-testid="new-entry-page">
          <h2>New Entry</h2>
          <form data-testid="new-entry-form">
            <input data-testid="input-title" placeholder="Title" />
            <textarea data-testid="input-body" placeholder="What happened today?" />
            <select data-testid="input-mood">
              <option value="great">Great</option>
              <option value="good">Good</option>
              <option value="okay">Okay</option>
              <option value="bad">Bad</option>
              <option value="terrible">Terrible</option>
            </select>
            <input data-testid="input-tags" placeholder="Tags (comma separated)" />
            <button type="submit" data-testid="submit-entry">Save Entry</button>
          </form>
        </div>
      )}
      {route === "search" && (
        <div data-testid="search-page">
          <h2>Search Entries</h2>
          <form data-testid="search-form">
            <input data-testid="search-input" placeholder="Search..." />
            <button type="submit" data-testid="search-btn">Search</button>
          </form>
          <ul data-testid="search-results" />
        </div>
      )}
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

import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div>
      <NavBar />
      {route.name === "home" && (
        <div data-testid="home-page">
          <h1>Legal Document Manager</h1>
          <div data-testid="stat-total">Total: 0</div>
          <div data-testid="stat-active">Active: 0</div>
          <div data-testid="stat-draft">Draft: 0</div>
          <button data-testid="go-to-docs">View Documents</button>
        </div>
      )}
      {route.name === "list" && (
        <div data-testid="list-page">
          <h2>Documents</h2>
          <select data-testid="filter-category"><option value="All">All Categories</option></select>
          <select data-testid="filter-status"><option value="All">All Statuses</option></select>
          <button data-testid="add-doc-btn">Add Document</button>
          <div data-testid="no-docs">No documents found</div>
        </div>
      )}
      {route.name === "add" && (
        <div data-testid="add-page">
          <h2>Add Document</h2>
          <form data-testid="add-form">
            <input data-testid="input-title" />
            <select data-testid="input-category"><option value="Contract">Contract</option></select>
            <select data-testid="input-status"><option value="Draft">Draft</option></select>
            <button type="submit" data-testid="submit-btn">Save</button>
            <button type="button" data-testid="cancel-btn">Cancel</button>
          </form>
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

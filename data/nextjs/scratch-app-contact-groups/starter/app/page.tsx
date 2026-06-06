import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && (
        <div data-testid="contacts-page">
          <h1>Contacts</h1>
          <input data-testid="contact-name-input" placeholder="Name" />
          <input data-testid="contact-email-input" placeholder="Email" />
          <input data-testid="contact-phone-input" placeholder="Phone" />
          <input data-testid="contact-address-input" placeholder="Address" />
          <select data-testid="contact-group-select"><option value="">No Group</option></select>
          <button data-testid="add-contact-btn">Add Contact</button>
          <select data-testid="filter-group-select"><option value="">All Groups</option></select>
          <ul data-testid="contact-list"></ul>
        </div>
      )}
      {route === "/groups" && (
        <div data-testid="groups-page">
          <h1>Groups</h1>
          <input data-testid="group-name-input" placeholder="Group Name" />
          <input data-testid="group-color-input" placeholder="Color" />
          <button data-testid="add-group-btn">Add Group</button>
          <ul data-testid="group-list"></ul>
        </div>
      )}
      {route === "/favorites" && (
        <div data-testid="favorites-page">
          <h1>Favorites</h1>
          <div data-testid="favorites-count">0</div>
          <ul data-testid="favorites-list"></ul>
        </div>
      )}
      {route === "/import" && (
        <div data-testid="import-page">
          <h1>Import Contacts</h1>
          <textarea data-testid="import-csv-input" placeholder="name,email,phone (one per line)" />
          <button data-testid="import-btn">Import</button>
          <div data-testid="import-count">0</div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}

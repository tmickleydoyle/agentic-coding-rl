import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <div data-testid="dashboard-page"><h1>Insurance Vault</h1><div data-testid="active-policy-count">0</div><div data-testid="open-claims-count">0</div></div>}
      {route === "/policies" && (
        <div data-testid="policies-page">
          <h1>Policies</h1>
          <input data-testid="policy-name-input" placeholder="Policy Name" />
          <select data-testid="policy-type-select"><option value="home">Home</option></select>
          <input data-testid="policy-provider-input" placeholder="Provider" />
          <input data-testid="policy-number-input" placeholder="Policy Number" />
          <input data-testid="policy-premium-input" placeholder="Premium" type="number" />
          <input data-testid="policy-start-input" placeholder="Start Date" />
          <input data-testid="policy-end-input" placeholder="End Date" />
          <button data-testid="add-policy-btn">Add Policy</button>
          <ul data-testid="policy-list"></ul>
        </div>
      )}
      {route === "/claims" && (
        <div data-testid="claims-page">
          <h1>Claims</h1>
          <select data-testid="claim-policy-select"><option value="">Select Policy</option></select>
          <input data-testid="claim-description-input" placeholder="Description" />
          <input data-testid="claim-amount-input" placeholder="Amount" type="number" />
          <input data-testid="claim-date-input" placeholder="Date" />
          <button data-testid="add-claim-btn">File Claim</button>
          <ul data-testid="claim-list"></ul>
        </div>
      )}
      {route === "/documents" && (
        <div data-testid="documents-page">
          <h1>Documents</h1>
          <select data-testid="doc-policy-select"><option value="">Select Policy</option></select>
          <input data-testid="doc-name-input" placeholder="Document Name" />
          <input data-testid="doc-url-input" placeholder="URL" />
          <input data-testid="doc-type-input" placeholder="Type" />
          <button data-testid="add-doc-btn">Add Document</button>
          <ul data-testid="doc-list"></ul>
        </div>
      )}
      {route === "/contacts" && (
        <div data-testid="contacts-page">
          <h1>Contacts</h1>
          <input data-testid="contact-name-input" placeholder="Name" />
          <input data-testid="contact-company-input" placeholder="Company" />
          <input data-testid="contact-phone-input" placeholder="Phone" />
          <input data-testid="contact-email-input" placeholder="Email" />
          <input data-testid="contact-role-input" placeholder="Role" />
          <button data-testid="add-contact-btn">Add Contact</button>
          <ul data-testid="contact-list"></ul>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}

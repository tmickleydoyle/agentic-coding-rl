import React from "react";

export function ProfilesPage() {
  return (
    <div data-testid="profiles-page">
      <h1>Beneficiary Profiles</h1>
      <p data-testid="no-profiles">No profiles found.</p>
      <div data-testid="add-profile-form">
        <input data-testid="profile-name-input" placeholder="Name" />
        <input data-testid="profile-dob-input" type="date" />
        <input data-testid="profile-email-input" type="email" placeholder="Email" />
        <button data-testid="add-profile-btn">Add Profile</button>
      </div>
    </div>
  );
}

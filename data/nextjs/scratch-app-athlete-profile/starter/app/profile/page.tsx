import React from "react";

export default function ProfilePage() {
  return (
    <div data-testid="profile-page">
      <h1>Athlete Profile</h1>
      <div data-testid="profile-view">
        <p data-testid="profile-name">Jordan Smith</p>
        <p data-testid="profile-sport">Triathlon</p>
        <p data-testid="profile-dob">1995-08-20</p>
        <p data-testid="profile-bio">Competitive triathlete since 2015</p>
        <button data-testid="btn-edit-profile">Edit</button>
      </div>
    </div>
  );
}

import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function StudyGroupHome() {
  const { groups, members, sessions } = useApp();
  return (
    <div data-testid="home-page">
      <h1>Study Groups</h1>
      <div data-testid="stat-groups">{groups.length} groups</div>
      <div data-testid="stat-members">{members.length} members</div>
      <div data-testid="stat-sessions">{sessions.length} sessions</div>
    </div>
  );
}

import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function LanguageExchangeHome() {
  const { sessions, partners } = useApp();
  const onlineCount = partners.filter(p => p.online).length;
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  return (
    <div data-testid="home-page">
      <h1>Language Exchange</h1>
      <div data-testid="stats-online">{onlineCount} partners online</div>
      <div data-testid="stats-sessions">{sessions.length} sessions completed</div>
      <div data-testid="stats-minutes">{totalMinutes} total minutes</div>
    </div>
  );
}

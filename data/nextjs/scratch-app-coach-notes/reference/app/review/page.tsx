import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function ReviewPage() {
  const { athletes, sessions } = useApp();
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((s, x) => s + x.duration, 0);

  return (
    <div data-testid="review-page">
      <h1>Review</h1>
      <p data-testid="review-total-sessions">Total Sessions: {totalSessions}</p>
      <p data-testid="review-total-minutes">Total Minutes: {totalMinutes}</p>
      <ul data-testid="review-athletes-list">
        {athletes.map((a) => {
          const aSessions = sessions.filter((s) => s.athleteId === a.id);
          const aMinutes = aSessions.reduce((s, x) => s + x.duration, 0);
          return (
            <li key={a.id} data-testid={`review-athlete-${a.id}`}>
              <span data-testid={`review-athlete-name-${a.id}`}>{a.name}</span>
              <span data-testid={`review-athlete-sessions-${a.id}`}>{aSessions.length} sessions</span>
              <span data-testid={`review-athlete-minutes-${a.id}`}>{aMinutes} min</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

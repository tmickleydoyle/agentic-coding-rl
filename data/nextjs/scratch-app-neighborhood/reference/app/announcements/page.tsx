import React, { useState } from "react";
import { getAnnouncements, togglePin } from "../../lib/store";

export function AnnouncementsPage() {
  const [, setTick] = useState(0);
  const announcements = getAnnouncements();

  function handlePin(id: string) {
    togglePin(id);
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="announcements-page">
      <h2>Announcements</h2>
      {announcements.map((a) => (
        <div key={a.id} data-testid={`ann-row-${a.id}`}>
          <span data-testid={`ann-title-${a.id}`}>{a.title}</span>
          <span data-testid={`ann-body-${a.id}`}>{a.body}</span>
          {a.pinned && <span data-testid={`ann-pinned-${a.id}`}>Pinned</span>}
          <button data-testid={`ann-pin-btn-${a.id}`} onClick={() => handlePin(a.id)}>
            {a.pinned ? "Unpin" : "Pin"}
          </button>
        </div>
      ))}
    </div>
  );
}

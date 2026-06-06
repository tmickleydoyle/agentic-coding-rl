import React, { useState } from "react";
import { getMembers, promoteToAdmin } from "../../lib/store";

export function MembersPage() {
  const [, setTick] = useState(0);
  const members = getMembers();

  function handlePromote(id: string) {
    promoteToAdmin(id);
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="members-page">
      <h2>Members</h2>
      {members.map((m) => (
        <div key={m.id} data-testid={`member-row-${m.id}`}>
          <span data-testid={`member-name-${m.id}`}>{m.name}</span>
          <span data-testid={`member-role-${m.id}`}>{m.role}</span>
          <span data-testid={`member-joined-${m.id}`}>{m.joined}</span>
          {m.role === "Member" && (
            <button data-testid={`promote-${m.id}`} onClick={() => handlePromote(m.id)}>
              Promote to Admin
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

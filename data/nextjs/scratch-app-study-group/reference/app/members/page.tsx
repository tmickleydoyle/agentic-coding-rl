import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { addMember, joinGroup, leaveGroup } from "../../lib/store";

export default function MembersPage() {
  const { members, setMembers, groups, setGroups } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [joinMemberId, setJoinMemberId] = useState("");
  const [joinGroupId, setJoinGroupId] = useState("");
  const [joinError, setJoinError] = useState("");

  function handleAddMember() {
    if (!name.trim() || !email.trim()) { setError("Name and email required"); return; }
    const m = addMember({ name: name.trim(), email: email.trim(), groupIds: [] });
    setMembers([...members, m]);
    setName(""); setEmail(""); setError("");
  }

  function handleJoin() {
    if (!joinMemberId || !joinGroupId) { setJoinError("Select member and group"); return; }
    const ok = joinGroup(joinMemberId, joinGroupId);
    if (!ok) { setJoinError("Cannot join — group full or already member"); return; }
    setMembers(members.map(m => m.id === joinMemberId ? { ...m, groupIds: [...m.groupIds, joinGroupId] } : m));
    setGroups(groups.map(g => g.id === joinGroupId ? { ...g, memberIds: [...g.memberIds, joinMemberId] } : g));
    setJoinMemberId(""); setJoinGroupId(""); setJoinError("");
  }

  return (
    <div data-testid="members-page">
      <h2>Members</h2>
      {error && <div data-testid="member-error">{error}</div>}
      <ul data-testid="member-list">
        {members.map(m => (
          <li key={m.id} data-testid={`member-item-${m.id}`}>
            <span data-testid={`member-name-${m.id}`}>{m.name}</span>
            <span data-testid={`member-email-${m.id}`}>{m.email}</span>
            <span data-testid={`member-groups-${m.id}`}>{m.groupIds.length} groups</span>
          </li>
        ))}
      </ul>
      <div data-testid="add-member-form">
        <input data-testid="input-member-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input data-testid="input-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <button data-testid="btn-add-member" onClick={handleAddMember}>Add Member</button>
      </div>
      <div data-testid="join-group-form">
        {joinError && <div data-testid="join-error">{joinError}</div>}
        <select data-testid="select-join-member" value={joinMemberId} onChange={e => setJoinMemberId(e.target.value)}>
          <option value="">Select member</option>
          {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select data-testid="select-join-group" value={joinGroupId} onChange={e => setJoinGroupId(e.target.value)}>
          <option value="">Select group</option>
          {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <button data-testid="btn-join-group" onClick={handleJoin}>Join Group</button>
      </div>
    </div>
  );
}

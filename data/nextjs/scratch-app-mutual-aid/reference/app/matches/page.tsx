import React, { useState } from "react";
import { getRequests, getOffers, getMatches, createMatch } from "../../lib/store";

export function MatchesPage() {
  const [, setTick] = useState(0);
  const [requestId, setRequestId] = useState("");
  const [offerId, setOfferId] = useState("");
  const [matchedBy, setMatchedBy] = useState("");

  const matches = getMatches();
  const openRequests = getRequests().filter((r) => r.status === "Open");
  const availableOffers = getOffers().filter((o) => o.available);
  const allRequests = getRequests();
  const allOffers = getOffers();

  function getReqTitle(id: string) { return allRequests.find((r) => r.id === id)?.title ?? id; }
  function getOffTitle(id: string) { return allOffers.find((o) => o.id === id)?.title ?? id; }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!requestId || !offerId || !matchedBy.trim()) return;
    createMatch(requestId, offerId, matchedBy.trim());
    setRequestId(""); setOfferId(""); setMatchedBy("");
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="matches-page">
      <h2>Matches</h2>
      <form data-testid="match-form" onSubmit={handleSubmit}>
        <select data-testid="match-request" value={requestId} onChange={(e) => setRequestId(e.target.value)}>
          <option value="">Select request</option>
          {openRequests.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
        </select>
        <select data-testid="match-offer" value={offerId} onChange={(e) => setOfferId(e.target.value)}>
          <option value="">Select offer</option>
          {availableOffers.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
        </select>
        <input data-testid="match-by" placeholder="Matched by" value={matchedBy} onChange={(e) => setMatchedBy(e.target.value)} />
        <button data-testid="match-submit" type="submit">Create Match</button>
      </form>
      {matches.length === 0 ? (
        <p data-testid="empty-matches">No matches yet</p>
      ) : (
        matches.map((m) => (
          <div key={m.id} data-testid={`match-row-${m.id}`}>
            <span data-testid={`match-request-${m.id}`}>{getReqTitle(m.requestId)}</span>
            <span data-testid={`match-offer-${m.id}`}>{getOffTitle(m.offerId)}</span>
            <span data-testid={`match-by-${m.id}`}>{m.matchedBy}</span>
          </div>
        ))
      )}
    </div>
  );
}

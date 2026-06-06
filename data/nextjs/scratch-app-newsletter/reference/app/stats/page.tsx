"use client";
import React, { useEffect, useState } from "react";
import { Campaign, Subscriber } from "../../lib/types";

export function StatsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    fetch("/api/campaigns").then((r) => r.json()).then((d) => setCampaigns(d.campaigns ?? []));
    fetch("/api/subscribers").then((r) => r.json()).then((d) => setSubscribers(d.subscribers ?? []));
  }, []);

  const totalSubs = subscribers.length;
  const activeSubs = subscribers.filter((s) => s.active).length;
  const sent = campaigns.filter((c) => c.status === "sent");
  const avgOpenRate = sent.length === 0 ? 0 :
    Math.round(sent.reduce((acc, c) => acc + (c.sentCount > 0 ? (c.openCount / c.sentCount) * 100 : 0), 0) / sent.length);

  return (
    <div data-testid="stats-page">
      <h1>Stats</h1>
      <div data-testid="total-subscribers">{totalSubs}</div>
      <div data-testid="active-subscribers">{activeSubs}</div>
      <div data-testid="avg-open-rate">{avgOpenRate}%</div>
      <div data-testid="sent-campaigns">{sent.length}</div>
    </div>
  );
}

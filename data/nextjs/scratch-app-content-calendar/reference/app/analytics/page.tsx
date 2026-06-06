"use client";
import React, { useEffect, useState } from "react";
import { ContentItem } from "../../lib/types";

export function AnalyticsPage() {
  const [items, setItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then((d) => setItems(d.items ?? []));
  }, []);

  const byChannel: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  items.forEach((i) => {
    byChannel[i.channel] = (byChannel[i.channel] || 0) + 1;
    byStatus[i.status] = (byStatus[i.status] || 0) + 1;
  });

  return (
    <div data-testid="analytics-page">
      <h1>Analytics</h1>
      <div data-testid="total-items">{items.length}</div>
      <div data-testid="by-channel">
        {Object.keys(byChannel).map((ch) => (
          <div key={ch} data-testid={`channel-count-${ch}`}>{ch}: {byChannel[ch]}</div>
        ))}
      </div>
      <div data-testid="by-status">
        {Object.keys(byStatus).map((s) => (
          <div key={s} data-testid={`status-count-${s}`}>{s}: {byStatus[s]}</div>
        ))}
      </div>
    </div>
  );
}

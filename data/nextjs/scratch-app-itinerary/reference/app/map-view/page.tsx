import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function MapViewPage() {
  const { activities } = useApp();
  const locationMap: Record<string, number> = {};
  activities.forEach((a) => {
    locationMap[a.location] = (locationMap[a.location] ?? 0) + 1;
  });
  const locations = Object.keys(locationMap).sort();

  return (
    <div data-testid="map-view-page">
      <h2>Activities by Location</h2>
      {locations.map((loc) => (
        <div key={loc} data-testid="location-group">
          <span data-testid="location-name">{loc}</span>
          <span data-testid="location-activity-count">{locationMap[loc]}</span>
        </div>
      ))}
    </div>
  );
}

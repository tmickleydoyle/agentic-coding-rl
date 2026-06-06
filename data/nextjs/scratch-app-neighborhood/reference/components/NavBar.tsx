import React from "react";
import { useApp } from "./AppStateProvider";
export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-directory" onClick={() => navigate("directory")}>Directory</button>
      <button data-testid="nav-issues" onClick={() => navigate("issues")}>Issues</button>
      <button data-testid="nav-announcements" onClick={() => navigate("announcements")}>Announcements</button>
    </nav>
  );
}

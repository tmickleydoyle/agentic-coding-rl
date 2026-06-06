import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { route, navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button
        data-testid="nav-dashboard"
        onClick={() => navigate("/")}
        aria-current={route === "/" ? "page" : undefined}
      >
        Dashboard
      </button>
      <button
        data-testid="nav-tenants"
        onClick={() => navigate("/tenants")}
        aria-current={route === "/tenants" ? "page" : undefined}
      >
        Tenants
      </button>
      <button
        data-testid="nav-payments"
        onClick={() => navigate("/payments")}
        aria-current={route === "/payments" ? "page" : undefined}
      >
        Payments
      </button>
      <button
        data-testid="nav-settings"
        onClick={() => navigate("/settings")}
        aria-current={route === "/settings" ? "page" : undefined}
      >
        Settings
      </button>
    </nav>
  );
}

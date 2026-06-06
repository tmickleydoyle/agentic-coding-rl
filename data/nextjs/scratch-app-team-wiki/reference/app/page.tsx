import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import HomePage from "./home/page";
import PagesPage from "./pages/page";
import CategoriesPage from "./categories/page";
import SearchPage from "./search/page";

function Shell() {
  const { route } = useApp();
  let content: React.ReactNode;
  if (route === "/") content = <HomePage />;
  else if (route === "/pages") content = <PagesPage />;
  else if (route === "/categories") content = <CategoriesPage />;
  else if (route === "/search") content = <SearchPage />;
  else content = <div data-testid="not-found">404</div>;

  return (
    <div data-testid="app-shell">
      <NavBar />
      <main data-testid="main-content">{content}</main>
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}

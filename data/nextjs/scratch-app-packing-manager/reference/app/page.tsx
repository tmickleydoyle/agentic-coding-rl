import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import NavBar from "../components/NavBar";
import ListsPage from "./lists/page";
import AddListPage from "./add-list/page";
import ChecklistPage from "./checklist/page";

function Shell() {
  const { route, lists } = useApp();
  const allItems = lists.flatMap((l) => l.items);
  const checkedItems = allItems.filter((i) => i.checked);

  let content: React.ReactNode;
  if (route === "/lists") content = <ListsPage />;
  else if (route === "/add-list") content = <AddListPage />;
  else if (route === "/checklist") content = <ChecklistPage />;
  else content = (
    <div data-testid="home-page">
      <h1>Packing Manager</h1>
      <p data-testid="home-list-count">{lists.length}</p>
      <p data-testid="home-item-count">{allItems.length}</p>
      <p data-testid="home-checked-count">{checkedItems.length}</p>
    </div>
  );

  return (
    <div>
      <NavBar />
      {content}
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

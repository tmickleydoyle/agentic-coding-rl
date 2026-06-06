import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("WIP Project Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByText("WIP Project Tracker")).toBeTruthy();
  });

  it("shows all 4 seed projects on load", () => {
    expect(screen.getByTestId("project-1")).toBeTruthy();
    expect(screen.getByTestId("project-4")).toBeTruthy();
  });

  it("displays correct seed data fields", () => {
    expect(screen.getByTestId("project-title-1").textContent).toBe("Macrame Wall Hanging");
    expect(screen.getByTestId("project-type-1").textContent).toBe("Macrame");
    expect(screen.getByTestId("project-date-1").textContent).toBe("2024-01-10");
    expect(screen.getByTestId("project-progress-1").textContent).toBe("40%");
  });

  it("shows correct average progress", () => {
    // (40+70+20+90)/4 = 55
    expect(screen.getByTestId("avg-progress").textContent).toBe("Average: 55%");
  });

  it("adds a new project", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Knit Socks");
    await user.type(screen.getByTestId("input-type"), "Knitting");
    await user.type(screen.getByTestId("input-progress"), "10");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("project-5")).toBeTruthy();
    expect(screen.getByTestId("project-title-5").textContent).toBe("Knit Socks");
    expect(screen.getByTestId("project-progress-5").textContent).toBe("10%");
  });

  it("does not add project with blank title", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-type"), "Knitting");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByTestId("project-5")).toBeNull();
  });

  it("clamps progress to 0-100 on add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Overclocked");
    await user.type(screen.getByTestId("input-progress"), "150");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("project-progress-5").textContent).toBe("100%");
  });

  it("deletes a project", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-2"));
    expect(screen.queryByTestId("project-2")).toBeNull();
  });

  it("sorts by progress ascending", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("sort-asc"));
    const cards = screen.getAllByTestId(/^project-\d+$/);
    const progresses = cards.map((c) => {
      const id = c.getAttribute("data-testid")!.replace("project-", "");
      return parseInt(screen.getByTestId(`project-progress-${id}`).textContent!, 10);
    });
    for (let i = 0; i < progresses.length - 1; i++) {
      expect(progresses[i]).toBeLessThanOrEqual(progresses[i + 1]);
    }
  });

  it("sorts by progress descending", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("sort-desc"));
    const cards = screen.getAllByTestId(/^project-\d+$/);
    const progresses = cards.map((c) => {
      const id = c.getAttribute("data-testid")!.replace("project-", "");
      return parseInt(screen.getByTestId(`project-progress-${id}`).textContent!, 10);
    });
    for (let i = 0; i < progresses.length - 1; i++) {
      expect(progresses[i]).toBeGreaterThanOrEqual(progresses[i + 1]);
    }
  });

  it("inline progress update changes displayed progress", async () => {
    const user = userEvent.setup();
    const editInput = screen.getByTestId("edit-progress-1");
    await user.clear(editInput);
    await user.type(editInput, "75");
    await user.click(screen.getByTestId("btn-update-1"));
    expect(screen.getByTestId("project-progress-1").textContent).toBe("75%");
  });

  it("shows empty-msg when all projects deleted", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    await user.click(screen.getByTestId("btn-delete-2"));
    await user.click(screen.getByTestId("btn-delete-3"));
    await user.click(screen.getByTestId("btn-delete-4"));
    expect(screen.getByTestId("empty-msg").textContent).toBe("No projects yet");
  });

  it("average updates after delete", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    // (70+20+90)/3 = 60
    expect(screen.getByTestId("avg-progress").textContent).toBe("Average: 60%");
  });
});

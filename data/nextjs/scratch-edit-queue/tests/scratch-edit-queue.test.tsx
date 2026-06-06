import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Edit Queue", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /edit queue/i })).toBeTruthy();
  });

  it("shows 4 items on load", () => {
    expect(screen.getByTestId("item-count").textContent).toContain("4");
  });

  it("shows correct status counts on load", () => {
    const counts = screen.getByTestId("status-counts").textContent ?? "";
    expect(counts).toContain("Pending: 2");
    expect(counts).toContain("In Progress: 1");
    expect(counts).toContain("Done: 1");
  });

  it("renders all seed items", () => {
    expect(screen.getByTestId("item-1")).toBeTruthy();
    expect(screen.getByTestId("item-4")).toBeTruthy();
  });

  it("displays filename and editor for seed item", () => {
    expect(screen.getByTestId("item-filename-1").textContent).toBe("DSC_0421.jpg");
    expect(screen.getByTestId("item-editor-1").textContent).toBe("Alice");
  });

  it("adds a new item", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-filename"), "IMG_9001.jpg");
    await user.type(screen.getByTestId("input-editor"), "Dave");
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("item-count").textContent).toContain("5");
    expect(screen.getByText("IMG_9001.jpg")).toBeTruthy();
  });

  it("clears inputs after add", async () => {
    const user = userEvent.setup();
    const fnInput = screen.getByTestId("input-filename") as HTMLInputElement;
    await user.type(fnInput, "IMG_9001.jpg");
    await user.type(screen.getByTestId("input-editor"), "Dave");
    await user.click(screen.getByTestId("submit-btn"));
    expect(fnInput.value).toBe("");
  });

  it("does not add with empty filename", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-editor"), "Dave");
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("item-count").textContent).toContain("4");
  });

  it("does not add with empty editor", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-filename"), "IMG_9001.jpg");
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("item-count").textContent).toContain("4");
  });

  it("deletes an item", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-3"));
    expect(screen.queryByTestId("item-3")).toBeNull();
    expect(screen.getByTestId("item-count").textContent).toContain("3");
  });

  it("inline status change updates counts", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("item-status-1"), "Done");
    const counts = screen.getByTestId("status-counts").textContent ?? "";
    expect(counts).toContain("Pending: 1");
    expect(counts).toContain("Done: 2");
  });

  it("notes are displayed for seed item", () => {
    expect(screen.getByTestId("item-notes-2").textContent).toContain("Retouching face");
  });

  it("deleting all items shows 0 and zeroed counts", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    await user.click(screen.getByTestId("delete-2"));
    await user.click(screen.getByTestId("delete-3"));
    await user.click(screen.getByTestId("delete-4"));
    expect(screen.getByTestId("item-count").textContent).toContain("0");
    const counts = screen.getByTestId("status-counts").textContent ?? "";
    expect(counts).toContain("Pending: 0");
    expect(counts).toContain("Done: 0");
  });
});

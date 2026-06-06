import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Auction Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByTestId("heading")).toHaveTextContent("Auction Tracker");
  });

  it("renders seed items", () => {
    expect(screen.getByTestId("auction-1")).toBeTruthy();
    expect(screen.getByTestId("auction-title-1")).toHaveTextContent("Antique Pocket Watch");
    expect(screen.getByTestId("auction-status-3")).toHaveTextContent("CLOSED");
  });

  it("shows open/closed counts and highest bid", () => {
    expect(screen.getByTestId("count-open")).toBeTruthy();
    expect(screen.getByTestId("count-closed")).toBeTruthy();
    expect(screen.getByTestId("highest-bid")).toBeTruthy();
  });

  it("adds a new auction item", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Bronze Figurine");
    await user.type(screen.getByTestId("input-description"), "Ancient Greek piece");
    await user.type(screen.getByTestId("input-starting-bid"), "300");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("auction-6")).toBeTruthy();
    expect(screen.getByTestId("auction-title-6")).toHaveTextContent("Bronze Figurine");
    expect(screen.getByTestId("auction-status-6")).toHaveTextContent("OPEN");
  });

  it("clears form after adding", async () => {
    const user = userEvent.setup();
    const titleInput = screen.getByTestId("input-title") as HTMLInputElement;
    await user.type(titleInput, "Item");
    await user.type(screen.getByTestId("input-starting-bid"), "100");
    await user.click(screen.getByTestId("btn-add"));
    expect(titleInput.value).toBe("");
  });

  it("shows error for empty title", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-starting-bid"), "100");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("form-error")).toHaveTextContent("Title is required");
  });

  it("shows error for starting bid <= 0", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Vase");
    await user.type(screen.getByTestId("input-starting-bid"), "0");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("form-error")).toHaveTextContent("Starting bid must be greater than 0");
  });

  it("places a valid bid", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("bid-input-1"), "300");
    await user.click(screen.getByTestId("btn-bid-1"));
    expect(screen.getByTestId("auction-bid-count-1").textContent).toBe("1");
  });

  it("shows bid error when bid is not higher than current", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("bid-input-1"), "200");
    await user.click(screen.getByTestId("btn-bid-1"));
    expect(screen.getByTestId("bid-error-1")).toHaveTextContent("Bid must exceed current bid");
  });

  it("closes an auction", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-close-1"));
    expect(screen.getByTestId("auction-status-1")).toHaveTextContent("CLOSED");
    expect(screen.queryByTestId("btn-close-1")).toBeNull();
    expect(screen.queryByTestId("bid-input-1")).toBeNull();
  });

  it("removes an item", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-remove-4"));
    expect(screen.queryByTestId("auction-4")).toBeNull();
  });

  it("filters by open status", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-status"), "open");
    expect(screen.queryByTestId("auction-3")).toBeNull();
    expect(screen.getByTestId("auction-1")).toBeTruthy();
  });

  it("filters by closed status", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-status"), "closed");
    expect(screen.getByTestId("auction-3")).toBeTruthy();
    expect(screen.queryByTestId("auction-1")).toBeNull();
  });

  it("summary reflects all items regardless of filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-status"), "open");
    expect(screen.getByTestId("count-closed").textContent).toContain("1");
  });
});

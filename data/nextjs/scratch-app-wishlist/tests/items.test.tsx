import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async (_url: string, opts?: RequestInit) => {
    const method = opts?.method || "GET";
    if (method === "POST") {
      const body = JSON.parse(opts!.body as string);
      return { json: async () => ({ id: "99", purchased: false, addedAt: "2024-06-01", ...body }) };
    }
    if (method === "PATCH") {
      const body = JSON.parse(opts!.body as string);
      return { json: async () => ({ id: body.id, name: "T", price: 50, url: "", category: "Cat", priority: "medium", purchased: body.purchased ?? false, addedAt: "2024-01-01" }) };
    }
    if (method === "DELETE") return { json: async () => ({ success: true }) };
    return { json: async () => [] };
  }));
});

describe("Items", () => {
  it("shows add item form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-items"));
    expect(screen.getByTestId("add-item-form")).toBeTruthy();
  });
  it("adds an item", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-items"));
    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "New Item" } });
    fireEvent.change(screen.getByTestId("input-price"), { target: { value: "50" } });
    fireEvent.change(screen.getByTestId("input-category"), { target: { value: "Tech" } });
    fireEvent.click(screen.getByTestId("btn-add-item"));
    await waitFor(() => { expect(screen.getByTestId("item-99")).toBeTruthy(); });
  });
  it("shows filter-all control", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-items"));
    expect(screen.getByTestId("filter-all")).toBeTruthy();
  });
});

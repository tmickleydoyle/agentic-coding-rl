import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async (_url: string, opts?: RequestInit) => {
    const method = opts?.method || "GET";
    if (method === "POST") {
      const body = JSON.parse(opts!.body as string);
      return { json: async () => ({ id: "99", addedAt: "2024-06-01", episodes: [], ...body }) };
    }
    if (method === "DELETE") return { json: async () => ({ success: true }) };
    if (method === "PATCH") {
      const body = JSON.parse(opts!.body as string);
      return { json: async () => ({ id: body.episodeId, played: body.played, playedAt: body.played ? "2024-06-01" : null }) };
    }
    return { json: async () => [] };
  }));
});

describe("Subscriptions", () => {
  it("shows add podcast form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-subscriptions"));
    expect(screen.getByTestId("add-podcast-form")).toBeTruthy();
  });
  it("subscribes to a podcast", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-subscriptions"));
    fireEvent.change(screen.getByTestId("input-title"), { target: { value: "My Pod" } });
    fireEvent.change(screen.getByTestId("input-host"), { target: { value: "Host" } });
    fireEvent.change(screen.getByTestId("input-category"), { target: { value: "Tech" } });
    fireEvent.change(screen.getByTestId("input-description"), { target: { value: "A podcast" } });
    fireEvent.click(screen.getByTestId("btn-add-podcast"));
    await waitFor(() => { expect(screen.getByTestId("podcast-item-99")).toBeTruthy(); });
  });
  it("shows unsubscribe button", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-subscriptions"));
    fireEvent.change(screen.getByTestId("input-title"), { target: { value: "Pod2" } });
    fireEvent.change(screen.getByTestId("input-host"), { target: { value: "H" } });
    fireEvent.change(screen.getByTestId("input-category"), { target: { value: "C" } });
    fireEvent.change(screen.getByTestId("input-description"), { target: { value: "D" } });
    fireEvent.click(screen.getByTestId("btn-add-podcast"));
    await waitFor(() => { expect(screen.getByTestId("btn-remove-99")).toBeTruthy(); });
  });
});

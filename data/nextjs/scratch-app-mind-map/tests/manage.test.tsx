import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../app/page";

const mockNodes: any[] = [];

beforeEach(() => {
  mockNodes.length = 0;
  (global as any).fetch = vi.fn(async (url: string, opts?: any) => {
    const u = String(url);
    if (opts?.method === "POST") {
      const body = JSON.parse(opts.body);
      if (!body.label?.trim()) return { json: async () => ({ error: "Label required" }), ok: false };
      const node = { id: String(mockNodes.length + 1), ...body, createdAt: "" };
      mockNodes.push(node);
      return { json: async () => ({ node }), ok: true, status: 201 };
    }
    if (opts?.method === "DELETE") {
      const id = new URL(u, "http://x").searchParams.get("id");
      const idx = mockNodes.findIndex((n) => n.id === id);
      if (idx !== -1) mockNodes.splice(idx, 1);
      return { json: async () => ({ success: true }), ok: true };
    }
    return { json: async () => ({ nodes: [...mockNodes] }), ok: true };
  });
});

describe("Manage Nodes", () => {
  it("shows empty nodes list", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-manage"));
    await waitFor(() => expect(screen.getByTestId("nodes-list")).toBeTruthy());
  });

  it("adds a node", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-manage"));
    fireEvent.change(screen.getByTestId("input-label"), { target: { value: "Central Idea" } });
    fireEvent.click(screen.getByTestId("btn-submit"));
    await waitFor(() => expect(screen.getByTestId("node-label-row-1")).toBeTruthy());
    expect(screen.getByTestId("node-label-row-1").textContent).toBe("Central Idea");
  });

  it("shows error when label is empty", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-manage"));
    fireEvent.click(screen.getByTestId("btn-submit"));
    await waitFor(() => expect(screen.getByTestId("form-error")).toBeTruthy());
  });

  it("deletes a node", async () => {
    mockNodes.push({ id: "1", label: "Delete Me", parentId: null, color: "blue", createdAt: "" });
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-manage"));
    await waitFor(() => expect(screen.getByTestId("node-row-1")).toBeTruthy());
    fireEvent.click(screen.getByTestId("btn-delete-1"));
    await waitFor(() => expect(screen.queryByTestId("node-row-1")).toBeNull());
  });
});

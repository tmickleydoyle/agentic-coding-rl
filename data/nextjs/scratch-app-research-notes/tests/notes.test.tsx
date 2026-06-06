import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../app/page";

const mockNotes: any[] = [];

beforeEach(() => {
  mockNotes.length = 0;
  (global as any).fetch = vi.fn(async (url: string, opts?: any) => {
    const u = typeof url === "string" ? url : String(url);
    if (opts?.method === "POST") {
      const body = JSON.parse(opts.body);
      if (!body.title?.trim()) return { json: async () => ({ error: "Title is required" }), ok: false, status: 400 };
      const note = { id: String(mockNotes.length + 1), ...body, createdAt: "", updatedAt: "" };
      mockNotes.push(note);
      return { json: async () => ({ note }), ok: true, status: 201 };
    }
    if (opts?.method === "DELETE") {
      const id = new URL(u, "http://x").searchParams.get("id");
      const idx = mockNotes.findIndex((n) => n.id === id);
      if (idx !== -1) mockNotes.splice(idx, 1);
      return { json: async () => ({ success: true }), ok: true };
    }
    if (opts?.method === "PUT") {
      const id = new URL(u, "http://x").searchParams.get("id");
      const body = JSON.parse(opts.body);
      const idx = mockNotes.findIndex((n) => n.id === id);
      if (idx !== -1) mockNotes[idx] = { ...mockNotes[idx], ...body };
      return { json: async () => ({ note: mockNotes[idx] }), ok: true };
    }
    return { json: async () => ({ notes: [...mockNotes] }), ok: true };
  });
});

describe("Research Notes CRUD", () => {
  it("shows empty notes list", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("notes-list")).toBeTruthy());
  });

  it("adds a note", async () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("input-title"), { target: { value: "My Note" } });
    fireEvent.change(screen.getByTestId("input-content"), { target: { value: "Some content" } });
    fireEvent.click(screen.getByTestId("btn-submit"));
    await waitFor(() => expect(screen.getByTestId("note-title-1")).toBeTruthy());
    expect(screen.getByTestId("note-title-1").textContent).toBe("My Note");
  });

  it("shows error when title is empty", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("btn-submit"));
    await waitFor(() => expect(screen.getByTestId("form-error")).toBeTruthy());
  });

  it("deletes a note", async () => {
    mockNotes.push({ id: "1", title: "To Delete", content: "", tags: [], sourceUrl: "", createdAt: "", updatedAt: "" });
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("note-item-1")).toBeTruthy());
    fireEvent.click(screen.getByTestId("btn-delete-1"));
    await waitFor(() => expect(screen.queryByTestId("note-item-1")).toBeNull());
  });
});

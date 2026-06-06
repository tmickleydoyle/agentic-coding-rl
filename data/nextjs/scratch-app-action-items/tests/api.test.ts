import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PUT, DELETE } from "../app/api/items/route";
import { __reset } from "../lib/store";

beforeEach(() => __reset());

describe("Action Items API", () => {
  it("GET returns empty list", async () => {
    const res = await GET(new Request("http://localhost/api/items"));
    const d = await res.json();
    expect(d.items).toEqual([]);
  });

  it("POST creates item", async () => {
    const res = await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Review PR", assignee: "Alice", dueDate: "2024-02-01", priority: "high", notes: "", completed: false }),
    }));
    expect(res.status).toBe(201);
    const d = await res.json();
    expect(d.item.title).toBe("Review PR");
    expect(d.item.priority).toBe("high");
  });

  it("POST rejects missing title", async () => {
    const res = await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignee: "Bob" }),
    }));
    expect(res.status).toBe(400);
  });

  it("PUT marks item as completed", async () => {
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Task A", assignee: "", dueDate: "", priority: "low", notes: "", completed: false }),
    }));
    const res = await PUT(new Request("http://localhost/api/items?id=1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    }));
    const d = await res.json();
    expect(d.item.completed).toBe(true);
  });

  it("GET with priority filter", async () => {
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "High priority task", assignee: "", dueDate: "", priority: "high", notes: "", completed: false }),
    }));
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Low priority task", assignee: "", dueDate: "", priority: "low", notes: "", completed: false }),
    }));
    const res = await GET(new Request("http://localhost/api/items?priority=high"));
    const d = await res.json();
    expect(d.items).toHaveLength(1);
    expect(d.items[0].priority).toBe("high");
  });

  it("GET with completed filter", async () => {
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Done task", assignee: "", dueDate: "", priority: "medium", notes: "", completed: true }),
    }));
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Open task", assignee: "", dueDate: "", priority: "medium", notes: "", completed: false }),
    }));
    const res = await GET(new Request("http://localhost/api/items?completed=1"));
    const d = await res.json();
    expect(d.items).toHaveLength(1);
    expect(d.items[0].title).toBe("Done task");
  });
});

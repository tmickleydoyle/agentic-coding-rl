import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PUT, DELETE } from "../app/api/items/route";
import { __reset } from "../lib/store";

beforeEach(() => __reset());

describe("Meeting Notes API", () => {
  it("GET returns empty list", async () => {
    const res = await GET(new Request("http://localhost/api/items"));
    const d = await res.json();
    expect(d.meetings).toEqual([]);
  });

  it("POST creates meeting", async () => {
    const res = await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Sprint Planning", date: "2024-01-15", attendees: "Alice, Bob", notes: "Discussed Q1 goals", actionItems: "", agenda: [] }),
    }));
    expect(res.status).toBe(201);
    const d = await res.json();
    expect(d.meeting.title).toBe("Sprint Planning");
  });

  it("POST rejects missing title", async () => {
    const res = await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2024-01-01" }),
    }));
    expect(res.status).toBe(400);
  });

  it("DELETE removes meeting", async () => {
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Del Me", date: "", attendees: "", notes: "", actionItems: "", agenda: [] }),
    }));
    await DELETE(new Request("http://localhost/api/items?id=1", { method: "DELETE" }));
    const res = await GET(new Request("http://localhost/api/items"));
    const d = await res.json();
    expect(d.meetings).toHaveLength(0);
  });

  it("GET with search query filters", async () => {
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Budget Review", date: "", attendees: "CFO", notes: "finance discussion", actionItems: "", agenda: [] }),
    }));
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Team Sync", date: "", attendees: "Dev team", notes: "sprint review", actionItems: "", agenda: [] }),
    }));
    const res = await GET(new Request("http://localhost/api/items?q=budget"));
    const d = await res.json();
    expect(d.meetings).toHaveLength(1);
    expect(d.meetings[0].title).toBe("Budget Review");
  });

  it("PUT updates meeting notes", async () => {
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "M1", date: "", attendees: "", notes: "", actionItems: "", agenda: [] }),
    }));
    const res = await PUT(new Request("http://localhost/api/items?id=1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: "Updated notes" }),
    }));
    const d = await res.json();
    expect(d.meeting.notes).toBe("Updated notes");
  });
});

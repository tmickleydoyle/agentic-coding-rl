import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/entries/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/entries", () => {
  it("returns seed entries", async () => {
    const res = GET();
    const data = await res.json();
    expect(data.length).toBe(3);
  });

  it("returns entries with correct fields", async () => {
    const res = GET();
    const data = await res.json();
    expect(data[0]).toHaveProperty("title");
    expect(data[0]).toHaveProperty("country");
  });
});

describe("POST /api/entries", () => {
  it("creates a new entry", async () => {
    const req = new Request("http://localhost/api/entries", {
      method: "POST",
      body: JSON.stringify({ title: "Berlin Day 1", country: "Germany", city: "Berlin", date: "2024-07-10", mood: "happy", body: "Wonderful city.", rating: 5 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("Berlin Day 1");
    expect(data.id).toBeTruthy();
  });

  it("increments entry count", async () => {
    const req = new Request("http://localhost/api/entries", {
      method: "POST",
      body: JSON.stringify({ title: "Lisbon", country: "Portugal", city: "Lisbon", date: "2024-08-01", mood: "neutral", body: "Nice.", rating: 4 }),
    });
    await POST(req);
    const res = GET();
    const data = await res.json();
    expect(data.length).toBe(4);
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PATCH, DELETE } from "../app/api/shows/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Shows API", () => {
  it("GET returns shows", async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
  it("POST adds a show", async () => {
    const req = new Request("http://localhost/api/shows", {
      method: "POST",
      body: JSON.stringify({ title: "New Show", network: "HBO", genre: "Drama", totalSeasons: 3 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("New Show");
    expect(data.status).toBe("want-to-watch");
  });
  it("PATCH updates status", async () => {
    const req = new Request("http://localhost/api/shows", {
      method: "PATCH",
      body: JSON.stringify({ id: "1", status: "watching" }),
    });
    const res = await PATCH(req);
    const data = await res.json();
    expect(data.status).toBe("watching");
  });
  it("DELETE removes show", async () => {
    const req = new Request("http://localhost/api/shows", { method: "DELETE", body: JSON.stringify({ id: "1" }) });
    await DELETE(req);
    const listRes = await GET();
    const list = await listRes.json();
    expect(list.find((s: { id: string }) => s.id === "1")).toBeUndefined();
  });
  it("PATCH toggles favorite", async () => {
    const req = new Request("http://localhost/api/shows", {
      method: "PATCH",
      body: JSON.stringify({ id: "2", favorite: true }),
    });
    const res = await PATCH(req);
    const data = await res.json();
    expect(data.favorite).toBe(true);
  });
});

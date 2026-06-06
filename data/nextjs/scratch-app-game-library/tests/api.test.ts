import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PATCH, DELETE } from "../app/api/games/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Games API", () => {
  it("GET returns games", async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
  it("POST adds a game", async () => {
    const req = new Request("http://localhost/api/games", {
      method: "POST",
      body: JSON.stringify({ title: "Test Game", developer: "Dev", genre: "RPG", platform: "PC", estimatedHours: 50 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("Test Game");
    expect(data.status).toBe("wishlist");
  });
  it("PATCH updates status", async () => {
    const req = new Request("http://localhost/api/games", {
      method: "PATCH",
      body: JSON.stringify({ id: "1", status: "completed" }),
    });
    const res = await PATCH(req);
    const data = await res.json();
    expect(data.status).toBe("completed");
  });
  it("DELETE removes game", async () => {
    const req = new Request("http://localhost/api/games", { method: "DELETE", body: JSON.stringify({ id: "1" }) });
    await DELETE(req);
    const listRes = await GET();
    const list = await listRes.json();
    expect(list.find((g: { id: string }) => g.id === "1")).toBeUndefined();
  });
});

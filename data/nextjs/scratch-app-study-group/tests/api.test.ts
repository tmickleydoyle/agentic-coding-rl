import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/groups/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Groups API", () => {
  it("GET returns all groups", async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(3);
  });

  it("POST creates a group", async () => {
    const req = new Request("http://localhost/api/groups", {
      method: "POST",
      body: JSON.stringify({ name: "Art Circle", subject: "Art", description: "Explore art", maxMembers: 4, meetingFormat: "in-person" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Art Circle");
  });

  it("POST rejects missing fields", async () => {
    const req = new Request("http://localhost/api/groups", {
      method: "POST",
      body: JSON.stringify({ name: "Incomplete" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("DELETE removes group", async () => {
    const req = new Request("http://localhost/api/groups?id=g1", { method: "DELETE" });
    const res = await DELETE(req);
    expect(res.status).toBe(200);
    const check = await GET();
    const data = await check.json();
    expect(data.find((g: { id: string }) => g.id === "g1")).toBeUndefined();
  });

  it("DELETE 404 for unknown", async () => {
    const req = new Request("http://localhost/api/groups?id=none", { method: "DELETE" });
    const res = await DELETE(req);
    expect(res.status).toBe(404);
  });
});

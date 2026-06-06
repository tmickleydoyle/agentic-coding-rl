import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/athletes/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("API /api/athletes", () => {
  it("GET returns seed athletes", async () => {
    const res = GET(new Request("http://localhost/api/athletes"));
    const data = await res.json();
    expect(data.length).toBe(2);
    expect(data[0].name).toBe("Alice Johnson");
  });

  it("POST adds an athlete", async () => {
    const req = new Request("http://localhost/api/athletes", {
      method: "POST",
      body: JSON.stringify({ name: "Carol", sport: "Tennis", position: "Singles" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Carol");
  });

  it("POST rejects missing fields", async () => {
    const req = new Request("http://localhost/api/athletes", {
      method: "POST",
      body: JSON.stringify({ name: "Carol" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("DELETE removes an athlete", async () => {
    const req = new Request("http://localhost/api/athletes?id=1", { method: "DELETE" });
    const res = DELETE(req);
    expect(res.status).toBe(200);
    const getRes = GET(new Request("http://localhost/api/athletes"));
    const data = await getRes.json();
    expect(data.length).toBe(1);
  });

  it("DELETE returns 404 for unknown id", async () => {
    const req = new Request("http://localhost/api/athletes?id=999", { method: "DELETE" });
    const res = DELETE(req);
    expect(res.status).toBe(404);
  });
});

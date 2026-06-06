import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/teams/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("API /api/teams", () => {
  it("GET returns 3 seed teams", async () => {
    const res = GET(new Request("http://localhost/api/teams"));
    const data = await res.json();
    expect(data.length).toBe(3);
  });

  it("POST adds a team", async () => {
    const req = new Request("http://localhost/api/teams", {
      method: "POST",
      body: JSON.stringify({ name: "Purple Wolves", city: "Seattle", coach: "Jane Doe" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Purple Wolves");
  });

  it("DELETE removes a team", async () => {
    const req = new Request("http://localhost/api/teams?id=1", { method: "DELETE" });
    const res = DELETE(req);
    expect(res.status).toBe(200);
    const getRes = GET(new Request("http://localhost/api/teams"));
    const data = await getRes.json();
    expect(data.length).toBe(2);
  });

  it("DELETE 404 for unknown", async () => {
    const res = DELETE(new Request("http://localhost/api/teams?id=999", { method: "DELETE" }));
    expect(res.status).toBe(404);
  });
});

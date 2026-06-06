import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/assignments/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Assignments API", () => {
  it("GET returns assignments", async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(4);
  });

  it("POST creates assignment", async () => {
    const req = new Request("http://localhost/api/assignments", {
      method: "POST",
      body: JSON.stringify({ title: "New Task", subject: "Art", dueDate: "2024-05-01", estimatedMinutes: 20 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("New Task");
    expect(data.status).toBe("todo");
  });

  it("POST rejects missing title", async () => {
    const req = new Request("http://localhost/api/assignments", {
      method: "POST",
      body: JSON.stringify({ subject: "Math", dueDate: "2024-05-01" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("DELETE removes assignment", async () => {
    const req = new Request("http://localhost/api/assignments?id=a1", { method: "DELETE" });
    const res = await DELETE(req);
    expect(res.status).toBe(200);
  });

  it("DELETE 404 for unknown", async () => {
    const req = new Request("http://localhost/api/assignments?id=none", { method: "DELETE" });
    const res = await DELETE(req);
    expect(res.status).toBe(404);
  });
});

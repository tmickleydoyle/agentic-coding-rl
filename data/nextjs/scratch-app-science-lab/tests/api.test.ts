import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/experiments/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Experiments API", () => {
  it("GET returns experiments", async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(3);
  });

  it("POST creates experiment", async () => {
    const req = new Request("http://localhost/api/experiments", {
      method: "POST",
      body: JSON.stringify({ title: "New Experiment", hypothesis: "Test hypothesis", subject: "Physics", startDate: "2024-05-01" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("New Experiment");
    expect(data.status).toBe("planned");
  });

  it("POST rejects missing fields", async () => {
    const req = new Request("http://localhost/api/experiments", {
      method: "POST",
      body: JSON.stringify({ title: "Incomplete" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("GET returns all after POST", async () => {
    const req = new Request("http://localhost/api/experiments", {
      method: "POST",
      body: JSON.stringify({ title: "Extra", hypothesis: "H", subject: "Biology", startDate: "2024-05-01" }),
    });
    await POST(req);
    const res = await GET();
    const data = await res.json();
    expect(data.length).toBe(4);
  });
});

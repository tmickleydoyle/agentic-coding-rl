import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/exams/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Exams API", () => {
  it("GET returns exams", async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(3);
  });

  it("POST creates exam", async () => {
    const req = new Request("http://localhost/api/exams", {
      method: "POST",
      body: JSON.stringify({ title: "New Exam", subject: "Physics", date: "2024-06-01", totalQuestions: 10 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("New Exam");
    expect(data.status).toBe("upcoming");
  });

  it("POST rejects missing title", async () => {
    const req = new Request("http://localhost/api/exams", {
      method: "POST",
      body: JSON.stringify({ subject: "Math", date: "2024-06-01", totalQuestions: 10 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("POST rejects zero totalQuestions", async () => {
    const req = new Request("http://localhost/api/exams", {
      method: "POST",
      body: JSON.stringify({ title: "Bad", subject: "Math", date: "2024-06-01", totalQuestions: 0 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

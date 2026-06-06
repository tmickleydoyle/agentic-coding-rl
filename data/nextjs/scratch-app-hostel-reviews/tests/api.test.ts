import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/reviews/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/reviews", () => {
  it("returns 3 seed reviews", async () => {
    const res = GET();
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});

describe("POST /api/reviews", () => {
  it("creates review with 201", async () => {
    const req = new Request("http://localhost/api/reviews", {
      method: "POST",
      body: JSON.stringify({ hostelName: "Mountain Lodge", city: "Queenstown", country: "New Zealand", rating: 5, cleanliness: 5, location: 5, value: 4, date: "2024-07-01", comment: "Amazing!" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.hostelName).toBe("Mountain Lodge");
  });

  it("count grows", async () => {
    const req = new Request("http://localhost/api/reviews", {
      method: "POST",
      body: JSON.stringify({ hostelName: "Mountain Lodge", city: "Queenstown", country: "New Zealand", rating: 5, cleanliness: 5, location: 5, value: 4, date: "2024-07-01", comment: "Amazing!" }),
    });
    await POST(req);
    const res = GET();
    const data = await res.json();
    expect(data.length).toBe(4);
  });
});

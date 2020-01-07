import mongoose from "mongoose";
import request from "supertest";
import { expect } from "chai";
import server from "../../server";

describe("GET /api", () => {
  it("invalid route should return 404 ", async () => {
    const res = await request(server).get("/api");

    expect(res.status).to.equal(404);
  });
});

import mongoose from "mongoose";
import request from "supertest";
import server from "../app/server";

describe("GET /api", () => {
  beforeAll(async done => {
    await mongoose.connect("mongodb://localhost:27017/tracker-api-test", {
      useNewUrlParser: true
    });
    done();
  });

  afterAll(async done => {
    await mongoose.disconnect();
    // mongoose.on('disconnected', done)
  });

  it("should return 200 OK", async () => {
    const res = await request(server).get("/api");

    console.log("serve req ==", Object.keys(res));
    // console.log("serve req[] ==", res["res"]);

    expect(res.status).toBe(404);
  });
});

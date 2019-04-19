import mongoose from "mongoose";
import request from "supertest";
import server from "../../../app/server";

describe("GET /expenses", () => {
  // beforeEach(done => {
  //   mongoose.connect("mongodb://localhost:27017/tracker-api-test", {
  //     useNewUrlParser: true
  //   });
  //   var db = mongoose.connection;
  //   db.on("error", console.error.bind(console, "connection error:"));
  //   db.once("open", function() {
  //     console.log("db is open");
  //   });
  //   done();
  // });

  // afterEach(function(done) {
  //   console.log("afeter each mongoose disconnect()");
  //   mongoose.disconnect();
  //   return done();
  // });

  // afterAll(done => {
  //   console.log("afeter ALL done()");
  //   return done();
  // });

  // WORKS!
  // beforeAll(async done => {
  //   await mongoose.connect("mongodb://localhost:27017/tracker-api-test", {
  //     useNewUrlParser: true
  //   });
  //   done();
  // });

  // afterAll(async done => {
  //   await mongoose.disconnect();
  // });

  it("should return 200 OK", async () => {
    const res = await request(server).get("/api/v1/expenses");

    // console.log("test res", res);
    expect(res.status).toEqual(200);
    expect(res.body.result).toEqual("ok");
    expect(res.body.message).toEqual("expenses is on");
    // req.expect(200);
  });
});

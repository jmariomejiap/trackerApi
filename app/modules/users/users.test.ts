import { expect } from "chai";
import mongoose from "mongoose";
import request from "supertest";
import server from "../../server";
import Users from "../../models/users";

describe("users resource", () => {
  // dummyUsers
  const dummyUsers = [
    {
      name: "Mario",
      lastName: "Mejia",
      email: "jmariomejiap@gmail.com",
      phoneNumber: "812-123-2893"
    },
    {
      name: "Claudia",
      lastName: "Rangel",
      email: "clrangel@gmail.com",
      phoneNumber: "812-123-0219"
    }
  ];

  beforeEach(async () => {
    // clean
    try {
      await Users.deleteMany({});
    } catch (error) {
      console.log("users error cleaning  ", error);
    }

    try {
      const mockedUsers = await Users.create(dummyUsers);
    } catch (error) {
      console.log("error beforeEach ", error);
    }
  });

  it("should return available users", async () => {
    const req = await request(server).get("/api/v1/users");

    expect(req.status).to.equal(200);
    expect(req.body.result).to.equal("ok");
    expect(req.body.users.length).to.equal(2);
    expect(req.body.details).to.have.lengthOf(0);
    // first users
    expect(req.body.users[0].name).to.equal("Mario");
    expect(req.body.users[0].lastName).to.equal("Mejia");
    expect(req.body.users[0].email).to.equal("jmariomejiap@gmail.com");
    expect(req.body.users[0].phoneNumber).to.equal("812-123-2893");
    // second users
    expect(req.body.users[1].name).to.equal("Claudia");
    expect(req.body.users[1].lastName).to.equal("Rangel");
    expect(req.body.users[1].email).to.equal("clrangel@gmail.com");
    expect(req.body.users[1].phoneNumber).to.equal("812-123-0219");
  });

  it("should return a specific user", async () => {
    const req = await request(server)
      .get("/api/v1/users")
      .query({
        name: "Claudia",
        lastName: "Rangel",
        email: "clrangel@gmail.com",
        phoneNumber: "812-123-0219"
      });

    expect(req.status).to.equal(200);
    expect(req.body.result).to.equal("ok");
    expect(req.body.users).to.have.lengthOf(1);
    expect(req.body.users[0].name).to.equal("Claudia");
    expect(req.body.users[0].lastName).to.equal("Rangel");
    expect(req.body.users[0].email).to.equal("clrangel@gmail.com");
    expect(req.body.users[0].phoneNumber).to.equal("812-123-0219");
  });

  it("should return a 400 Error if user doesn't exist", async () => {
    const req = await request(server)
      .get("/api/v1/users")
      .query({
        name: "luke",
        lastName: "skywalker",
        email: "lskywalker@gmail.com",
        phoneNumber: "812-223-0219"
      });

    expect(req.status).to.equal(400);
    expect(req.body.result).to.equal("error");
    expect(req.body.message).to.equal("invalid user");
    expect(req.body.details).to.equal("");
  });

  it("should return 400 if new user is missing params", async () => {
    const req = await request(server)
      .post("/api/v1/users")
      .send({
        name: "Gabriel",
        email: "gg@gmail.com",
        phoneNumber: "812-123-1111"
      });

    expect(req.status).to.equal(400);
    expect(req.body.result).to.equal("error");
    expect(req.body.message).to.equal("incomplete user information");
    expect(req.body.details).to.have.lengthOf(0);
    expect(req.body.details).to.equal("");
  });

  it("should return 500 and message if phone number is invalid", async () => {
    const req = await request(server)
      .post("/api/v1/users")
      .send({
        name: "Gabriel",
        lastName: "Galvis",
        email: "gg@gmail.com",
        phoneNumber: "812-1223-1111"
      });

    expect(req.status).to.equal(500);
    expect(req.body.result).to.equal("error");
    expect(req.body.message).to.equal("internal error");
    expect(req.body.details).to.equal("ValidationError");
  });

  it("should return 500 and message if email is invalid", async () => {
    const req = await request(server)
      .post("/api/v1/users")
      .send({
        name: "Gabriel",
        lastName: "Galvis",
        email: "gg@@gmail.com",
        phoneNumber: "812-1223-1111"
      });

    expect(req.status).to.equal(500);
    expect(req.body.result).to.equal("error");
    expect(req.body.message).to.equal("internal error");
    expect(req.body.details).to.equal("ValidationError");
  });

  it("should create an User", async () => {
    const req = await request(server)
      .post("/api/v1/users")
      .send({
        name: "Gabriel",
        lastName: "Galvis",
        email: "gg@gmail.com",
        phoneNumber: "812-123-1111"
      });

    expect(req.status).to.equal(201);
    expect(req.body.result).to.equal("ok");
    expect(req.body.userId).to.exist;
  });

  it("should return error if user already exist", async () => {
    const req = await request(server)
      .post("/api/v1/users")
      .send(dummyUsers[0]);

    expect(req.status).to.equal(500);
    expect(req.body.result).to.equal("error");
    expect(req.body.message).to.equal("internal error");
    expect(req.body.details).to.equal("MongoError");
  });

  it("should delete a user", async () => {
    const req = await request(server)
      .delete("/api/v1/users")
      .send(dummyUsers[0]);

    expect(req.status).to.equal(201);
    expect(req.body.result).to.equal("ok");
    expect(req.body.userId).to.equal("");
    expect(req.body.details).to.equal("user deleted");
  });

  it("should return an Error when trying to delete a invalid user", async () => {
    const req = await request(server)
      .delete("/api/v1/users")
      .send({
        name: "Darth",
        lastName: "Vader",
        email: "dvader@gmail.com",
        phoneNumber: "782-666-6666"
      });

    expect(req.status).to.equal(400);
    expect(req.body.result).to.equal("error");
    expect(req.body.userId).to.equal("");
    expect(req.body.details).to.equal("user doesn't exist");
  });
});

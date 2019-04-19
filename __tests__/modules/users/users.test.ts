import mongoose from "mongoose";
import request from "supertest";
import server from "../../../app/server";
import Users from "../../../app/models/users";

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

  beforeEach(async done => {
    await Users.deleteMany({});

    await Users.create(dummyUsers);

    done();
  });

  it("should return available users", async done => {
    const req = await request(server).get("/api/v1/users");

    expect(req.status).toEqual(200);
    expect(req.body.result).toEqual("ok");
    expect(req.body.users.length).toEqual(2);
    expect(req.body.details.length).toEqual(0);
    // first users
    expect(req.body.users[0].name).toEqual("Mario");
    expect(req.body.users[0].lastName).toEqual("Mejia");
    expect(req.body.users[0].email).toEqual("jmariomejiap@gmail.com");
    expect(req.body.users[0].phoneNumber).toEqual("812-123-2893");
    // second users
    expect(req.body.users[1].name).toEqual("Claudia");
    expect(req.body.users[1].lastName).toEqual("Rangel");
    expect(req.body.users[1].email).toEqual("clrangel@gmail.com");
    expect(req.body.users[1].phoneNumber).toEqual("812-123-0219");
    done();
  });

  it("should return a specific user", async done => {
    const req = await request(server)
      .get("/api/v1/users")
      .query({
        name: "Claudia",
        lastName: "Rangel",
        email: "clrangel@gmail.com",
        phoneNumber: "812-123-0219"
      });

    expect(req.status).toEqual(200);
    expect(req.body.result).toEqual("ok");
    expect(req.body.users.length).toEqual(1);
    expect(req.body.users[0].name).toEqual("Claudia");
    expect(req.body.users[0].lastName).toEqual("Rangel");
    expect(req.body.users[0].email).toEqual("clrangel@gmail.com");
    expect(req.body.users[0].phoneNumber).toEqual("812-123-0219");

    done();
  });
  it("should return a 400 Error if user doesn't exist", async done => {
    const req = await request(server)
      .get("/api/v1/users")
      .query({
        name: "luke",
        lastName: "skywalker",
        email: "lskywalker@gmail.com",
        phoneNumber: "812-223-0219"
      });

    expect(req.status).toEqual(400);
    expect(req.body.result).toEqual("error");
    expect(req.body.message).toEqual("invalid user");
    expect(req.body.details).toEqual("");

    done();
  });

  it("should return 400 if new user is missing params", async done => {
    const req = await request(server)
      .post("/api/v1/users")
      .send({
        name: "Gabriel",
        email: "gg@gmail.com",
        phoneNumber: "812-123-1111"
      });

    expect(req.status).toEqual(400);
    expect(req.body.result).toEqual("error");
    expect(req.body.message).toEqual("incomplete user information");
    expect(req.body.details.length).toEqual(0);
    expect(req.body.details).toEqual("");
    done();
  });

  it("should return 500 and message if phone number is invalid", async done => {
    const req = await request(server)
      .post("/api/v1/users")
      .send({
        name: "Gabriel",
        lastName: "Galvis",
        email: "gg@gmail.com",
        phoneNumber: "812-1223-1111"
      });

    expect(req.status).toEqual(500);
    expect(req.body.result).toEqual("error");
    expect(req.body.message).toEqual("internal error");
    expect(req.body.details).toEqual("ValidationError");
    done();
  });

  it("should return 500 and message if email is invalid", async done => {
    const req = await request(server)
      .post("/api/v1/users")
      .send({
        name: "Gabriel",
        lastName: "Galvis",
        email: "gg@@gmail.com",
        phoneNumber: "812-1223-1111"
      });

    expect(req.status).toEqual(500);
    expect(req.body.result).toEqual("error");
    expect(req.body.message).toEqual("internal error");
    expect(req.body.details).toEqual("ValidationError");
    done();
  });

  it("should create an User", async done => {
    const req = await request(server)
      .post("/api/v1/users")
      .send({
        name: "Gabriel",
        lastName: "Galvis",
        email: "gg@gmail.com",
        phoneNumber: "812-123-1111"
      });

    expect(req.status).toEqual(201);
    expect(req.body.result).toEqual("ok");
    expect(req.body.userId).toBeTruthy();
    done();
  });

  it("should return error if user already exist", async done => {
    const req = await request(server)
      .post("/api/v1/users")
      .send(dummyUsers[0]);

    expect(req.status).toEqual(500);
    expect(req.body.result).toEqual("error");
    expect(req.body.message).toEqual("internal error");
    expect(req.body.details).toEqual("MongoError");
    done();
  });

  it("should delete a user", async done => {
    const req = await request(server)
      .delete("/api/v1/users")
      .send(dummyUsers[0]);

    expect(req.status).toEqual(201);
    expect(req.body.result).toEqual("ok");
    expect(req.body.userId).toEqual("");
    expect(req.body.details).toEqual("user deleted");
    done();
  });

  it("should return an Error when trying to delete a invalid user", async done => {
    const req = await request(server)
      .delete("/api/v1/users")
      .send({
        name: "Darth",
        lastName: "Vader",
        email: "dvader@gmail.com",
        phoneNumber: "782-666-6666"
      });

    expect(req.status).toEqual(400);
    expect(req.body.result).toEqual("error");
    expect(req.body.userId).toEqual("");
    expect(req.body.details).toEqual("user doesn't exist");
    done();
  });
});

import { expect } from "chai";
import mongoose from "mongoose";
import request from "supertest";
import server from "../../server";
import Users from "../../models/users";
import Expenses from "../../models/expenses";

interface Internal {
  userId: string;
}

const internalHelper: Internal = {
  userId: ""
};

describe("expenses resource", () => {
  beforeEach(async () => {
    // clean
    try {
      await Expenses.deleteMany({});
      await Users.deleteMany({});
    } catch (error) {
      console.log("expense error cleaning ", error);
    }

    const dummyUser = await Users.create({
      name: "Simon",
      lastName: "Mejia",
      email: "simonmejia@gmail.com",
      phoneNumber: "812-123-2893"
    });

    internalHelper.userId = dummyUser._id.toString();

    try {
      await Expenses.create({
        userId: dummyUser._id,
        category: "coffee",
        amount: 7.5
      });
    } catch (error) {
      console.log("expense error beforeEach ", error);
    }
  });

  it("should return error if no user cookie is set", async () => {
    const res = await request(server)
      .get("/api/v1/expenses")
      .set("Cookie", [`name=Mario;lastName=Mejia`]);

    expect(res.status).to.equal(401);
    expect(res.body.result).to.equal("error");
    expect(res.body.message).to.equal("unauthorized user");
    expect(res.body.details).to.equal("");
  });

  it("should return all user expenses ", async () => {
    const res = await request(server)
      .get("/api/v1/expenses")
      .set("Cookie", [`name=Mario;lastName=Mejia;id=${internalHelper.userId}`]);

    const { data, message, result } = res.body;

    expect(res.status).to.equal(200);
    expect(result).to.equal("ok");
    expect(data).to.have.lengthOf(1);
    expect(data[0].userId.toString()).to.equal(internalHelper.userId);
    expect(data[0].category).to.equal("coffee");
    expect(data[0].amount).to.equal("7.5");
    expect(message).to.equal("");
  });

  // TODO: should only work if userId is part of the query.
  it("should return user expenses ", async () => {
    const res = await request(server)
      .get("/api/v1/expenses")
      .set("Cookie", [`name=Mario;lastName=Mejia;id=${internalHelper.userId}`]);

    const { data, message, result } = res.body;

    expect(res.status).to.equal(200);
    expect(result).to.equal("ok");
    expect(data).to.have.lengthOf(1);
    expect(data[0].userId.toString()).to.equal(internalHelper.userId);
    expect(data[0].category).to.equal("coffee");
    expect(data[0].amount).to.equal("7.5");
    expect(message).to.equal("");
  });
});

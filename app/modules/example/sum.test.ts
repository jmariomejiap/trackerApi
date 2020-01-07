import { expect } from "chai";
import sum from "./sum";

it("adds 1 + 2 to equal 3 in Typescript", () => {
  // const sum = require("../sum.ts").default;
  expect(sum(1, 2)).to.equal(3);
});

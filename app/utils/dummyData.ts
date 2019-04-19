import * as mongoose from "mongoose";
import Users from "../models/users";

export default function() {
  const createDummyData = async () => {
    const usersCount = await Users.estimatedDocumentCount();

    if (usersCount > 0) {
      return;
    }

    console.log("usersCount === ", usersCount);

    const firstUser = await Users.create({
      name: "Mario",
      lastName: "Mejia",
      email: "jmariomejiap@gmail.com",
      phoneNumber: "782-414-2893"
    });

    console.log("firtsUser == ", firstUser);
  };

  createDummyData();
}

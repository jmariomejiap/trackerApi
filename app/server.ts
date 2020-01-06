import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import expenses from "./modules/expenses/routes";
import users from "./modules/users/routes";
import logger from "./utils/logger";
import dummyData from "./utils/dummyData";

dotenv.config();

const { NODE_ENV, MONGODB_URI, MONGODB_URI_LOCAL } = process.env;

// const mongoDbTarget =
//   String(NODE_ENV) === "test" ? `${MONGODB_URI_LOCAL}-test` : ;

// console.log("server NODE ENV", NODE_ENV);

if (String(NODE_ENV) === "development") {
  mongoose.connect(String(MONGODB_URI_LOCAL), { useNewUrlParser: true });
  mongoose.set("useCreateIndex", true);
  var db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function() {
    console.log("db is open");
  });

  // seed dummy data
  dummyData();
}

const app: express.Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(logger);

app.use("/api/v1/expenses", expenses);
app.use("/api/v1/users", users);
app.use("*", (req, res) => {
  return res.status(404).send("tracker is responding ..");
});

export default app;

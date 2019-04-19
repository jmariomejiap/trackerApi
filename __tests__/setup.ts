import mongoose from "mongoose";

// Load models since we will not be instantiating our express server.
// require("../app/models/users");

// beforeEach(function(done) {
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

// // jest.setTimeout(3000);

beforeEach(async done => {
  await mongoose.connect("mongodb://localhost:27017/tracker-api-test", {
    useNewUrlParser: true
  });
  mongoose.set("useCreateIndex", true);
  done();
});

afterEach(async done => {
  await mongoose.disconnect();
  done();
});

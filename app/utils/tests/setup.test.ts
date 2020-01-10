import mongoose from "mongoose";

mongoose.Promise = global.Promise;

before(async () => {
  mongoose.connect("mongodb://localhost:27017/tracker-api-test", {
    bufferCommands: false,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    useCreateIndex: true,
    useNewUrlParser: true
  });

  mongoose.connection
    .once("open", function() {
      console.log("Connected to MongoDB!");
    })
    /* istanbul ignore next */
    .on("error", function(error) {
      console.log("Connection error : ", error);
    });
});

after(async () => {
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
});

import * as mongoose from "mongoose";

const goalsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  status: String
});

export default mongoose.model("Goals", goalsSchema);

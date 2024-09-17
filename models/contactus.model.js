import { model, Schema } from "mongoose";

const problemsSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userMobile: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userProblem: {
    type: String,
    required: true,
  }
});

export default model("Problems", problemsSchema);

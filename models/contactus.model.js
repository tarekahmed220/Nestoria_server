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
  },
  problemState: {
    type:String,
    enm:["pending,solved"],
    default: "pending",
  }
});

export default model("Problems", problemsSchema);

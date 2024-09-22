import mongoose ,{Schema,model}from "mongoose"

const chatSchema = new Schema(
  {
    chatName: { type: String, trim: true },//name of the reciver
    // isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.ObjectId, ref: "User" }],//senders and recievers
    latestMessage: {
      type: mongoose.Schema.ObjectId,
      ref: "Message",
    },
    // groupAdmin: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export { Chat};
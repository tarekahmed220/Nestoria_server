import { Conversation } from "../models/conversationModel.js";
const getConversation= async(userId)=>{
    

if(!userId) return null

  if (userId) {
    const userConv = await Conversation.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("messages")
      .populate("sender",'fullName email')
      .populate("receiver",'fullName email')
      .sort({ updatedAt: -1 });

    const conversation = userConv?.map((conv) => {
      const countUnseenMsg = conv?.messages?.reduce((prev, msg) => {
        const msgByUserId = msg?.user?.toString();

        if (msgByUserId !== userId) {
          return prev + (msg?.seen ? 0 : 1);
        } else {
          return prev;
        }
      }, 0);

      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unseenMsg: countUnseenMsg,
      };
    });

    return conversation;
  } else {
    return [];
  }
};

const getAllConversations = async (req, res) => {
  try { 
    const conversations = await getConversation(req.user?._id);
    res.status(200).json({ msg: "success", conversations });
  } catch (error) { 
    console.error("Error in getallConversations:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}
    export {getConversation,getAllConversations}
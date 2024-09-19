import asyncHandler from "express-async-handler"
import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js";
import { Message } from "../models/messageModel.js";
import catchAsync from "../handleErrors/catchAsync.js";
import { cloudinary } from "../uploads/cloudinary.js";
//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "fullName photo email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = catchAsync(async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "fullName photo");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "fullName photo email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const sendPhoto = catchAsync(async (req, res, next) => {
  const { photo, chatId } = req.body;
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  if (!chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newPhoto = {
    sender: req.user._id,
    photo: result.secure_url,
    cloudinary_id: result.public_id,
    chat: chatId,
  };

  try {
    var message = await Message.create(newPhoto);

    message = await message.populate("sender", "fullName photo");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "fullName photo email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const deleteMessage = catchAsync(async (req, res, next) => {
  const { messageId } = req.params;

  if (!messageId) {
    console.log("Invalid data passed into request");
    return next(new Error("Invalid data passed into request", 400)) 
  }

  
    const message = await Message.findByIdAndDelete(messageId);
  
    if (!message) {
      return next(new Error("Message not found", 404));  // Handling case where message is not found
    }
    res.json({ success: true , msg: "message deleted successfully"});

})
export { allMessages, sendMessage ,sendPhoto,deleteMessage};
import express from "express";

import {Server} from 'socket.io'
import http from 'http'
import { User } from "../models/userModel.js";
import { Message } from "../models/messageModel.js";
import { Conversation } from "../models/conversationModel.js";
import { getRandomValues } from "crypto";
import getUserByToken from "../utilits/getUserByToken.js";
import getupdatedConversation  from "../utilits/getupdatedConversation.js";
import { getAllMyConversations } from "../controllers/conversation.js";
const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        
    },
});
const onlineUsers = new Set();

io.on("connection", async(socket) => {
    //handshake connection between server and client
    //add user to online users - query=auth
    try{
const token=socket.handshake.auth.token
if(!token) {
    socket.disconnect();
    return;
}
console.log(token)
const user= await getUserByToken(token)
if(!user) {
    socket.disconnect();
    return;
}
    
//add user to room
socket.join(user.id.toString())

onlineUsers.add(user.id.toString())
//send online users
io.emit("onlineUser", Array.from(onlineUsers));
socket.on("connect_error", (err) => {
    // the reason of the error, for example "xhr poll error"
    console.log(err.message);
  
    // some additional description, for example the status code of the initial HTTP response
    console.log(err.description);
    // some additional context, for example the XMLHttpRequest object
    console.log(err.context);
  });
socket.on("messagePage",async (userId) => {
        const user= await User.findById(userId)
        const data={
            _id:user?._id,
            fullName:user?.fullName,
            photo:user?.photo,
            email:user?.email,
            online:onlineUsers?.has(userId),
         
        }
socket.emit("messageUser",data)
    const getAllMyConversations=await Conversation.find({
    $or:[
        {sender:user?._id,receiver:userId},
        {sender:userId,receiver:user?._id}
        ]}).populate('messages').sort({createdAt:-1})
socket.emit("allMyConversations",getAllMyConversations?.messages||[])
    });
    //new message
socket.on("newMessage", async (data) => {
try{
    const conversation = await Conversation.create({
        sender: data.sender,
        receiver: data.receiver,
    }) 
    if (!conversation) {
        conversation = await Conversation.create({
            sender: data.sender,
            receiver: data.receiver,
        });
    }
    const message = await Message.create({
        text: data.text,
        photo: data.photo,
})
if(message){
    await Conversation.updateOne({_id:conversation?._id},{
        $push:{
            messages:message?._id
        }
    })
}
const getupdatedConversation=await Conversation.findOne({
    $or:[
        {sender:data?.sender,receiver:data?.receiver},
        {sender:data?.receiver,receiver:data?.sender}
    ]
}).populate('messages').sort({createdAt:-1})

io.to(data?.sender).emit(
    "message",
    getupdatedConversation?.messages||[]
);
io.to(data?.receiver).emit(
    "message",
    getupdatedConversation?.messages||[]
)}catch(err){console.log(err)

}
//send conversation to frontend
const senderConv=await getAllMyConversations(data?.sender)
const receiverConv=await getAllMyConversations(data?.receiver)
io.to(data?.sender).emit("conversation",senderConv)
io.to(data?.receiver).emit("conversation",receiverConv)

})
socket.on("sidebar", async(userId) => {
       console.log(userId)
        const conversation=await getAllMyConversations(userId)
   socket.emit("conversation",conversation)
 })
    
socket.on("seen",async (msgByUser) => {    
    try{   
       let conversation=await Conversation.findOne({
        $or:[
            {sender:user?._id,receiver:msgByUser},
            {sender:msgByUser,receiver:user?._id}
        ]}).populate('messages')
        await Message?.updateMany({
            _id:{$in:conversation?.messages},
            msgByUser,
    },{
        $set:{
            seen:true
        }
    })
    //send conversation to frontend
const senderConv=await getAllMyConversations(user?._id)
const receiverConv=await getAllMyConversations(msgByUser)
io.to(user._id.toString()).emit("conversation",senderConv)
io.to(msgByUser).emit("conversation",receiverConv)
}catch(err){console.log(err)}
     
 })
    
    socket.on("disconnect", async() => {
        console.log("disconnected")
        onlineUsers?.delete(user._id?.toString());
       io.emit("onlineUsers", Array.from(onlineUsers));
    })
    
}catch(err){console.log(err)
    socket.disconnect();
}
});
// server.listen(5000, () => {
//     console.log("Server is listening on port 5000");
//   });
export {app,server}
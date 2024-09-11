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
import { console } from "inspector";
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
    // try{
const token=socket.handshake.auth.token
if(!token) {
    socket.disconnect();
    return;
}

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
//
// socket.on("connect_error", (err) => {
//     // the reason of the error, for example "xhr poll error"
//     console.log(err.message);
  
//     // some additional description, for example the status code of the initial HTTP response
//     console.log(err.description);
//     // some additional context, for example the XMLHttpRequest object
//     console.log(err.context);
//   });
socket.on("messagePage",async (userId) => {
   
    try{
        const userDetails= await User.findById(userId).select('-password')
        if(!userDetails){
            console.log("User not found");
            return;
        }
   
        const data={
            _id:userDetails?._id,
            fullName:userDetails?.fullName,
            photo:userDetails?.photo,
            email:userDetails?.email,
            online:onlineUsers?.has(userId),
         
        }
        // console.log(data)
socket.emit("messageUser",data)
    const getAllMyConversations=await Conversation.findOne({
    $or:[
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
        ]}).populate('messages').sort({updatedAt:-1})
socket.emit("allMyConversations",getAllMyConversations?.messages||[])
      } catch (error) {
        console.error("Error in messagePage event:", error);
      }  });
    //new message
socket.on("newMessage", async (data) => {
// try{
    let conversation = await Conversation.findOne({
        $or:[
            { sender: data?.sender, receiver: data?.receiver, },
            { sender: data?.receiver, receiver: data?.sender, },
            ]})
            //.populate('messages').sort({createdAt:-1})
    //     sender: data?.sender,
    //     receiver: data?.receiver,
    // }) 
    if (!conversation) {
        conversation = await Conversation.create({
            sender: data?.sender,
            receiver: data?.receiver,
        });
        console.log("Conversation created:", conversation);
    }
//     const message = new Message({
       
// })
const message = await Message?.create({
    text: data?.text,
        photo: data?.photo,
        user: data?.userId,
  });

  

if(message){
    await Conversation.updateOne({_id:conversation?._id},{
        $push:{
            messages:message?._id
        }
    })
    console.log("message created:",message)
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
)
// }catch(err){console.log(err)

// }
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
    
socket.on("seen",async (user) => {    
    // try{   
       let conversation=await Conversation.findOne({
        $or:[
            {sender:user?._id,receiver:user},
            {sender:user,receiver:user?._id}
        ]})//.populate('messages')
      const  convMessagesId=conversation?.messages||[]
        await Message?.updateMany({
            _id:{$in:convMessagesId},
            user,
    },{
        $set:{ seen:true}
    })
    //send conversation to frontend
const senderConv=await getAllMyConversations(user?._id.toString())
const receiverConv=await getAllMyConversations(user)
io.to(user?._id.toString()).emit("conversation",senderConv)
io.to(user).emit("conversation",receiverConv)
// }catch(err){console.log(err)}
     
 })
    
socket.on("disconnect", async() => {
        console.log("disconnected")
        onlineUsers?.delete(user?._id?.toString());
       io.emit("onlineUsers", Array.from(onlineUsers));
    })
    
// }catch(err){console.log(err)
//     socket.disconnect();
// }
});
// server.listen(5000, () => {
//     console.log("Server is listening on port 5000");
//   });
export {app,server}
import express from "express";

import {Server} from 'socket.io'
import http from 'http'
import { User } from "../models/userModel.js";
import { Message } from "../models/messageModel.js";
import { Conversation } from "../models/conversationModel.js";
import { getRandomValues } from "crypto";
import getUserByToken from "../utilits/getUserByToken.js";
import getupdatedConversation  from "../utilits/getupdatedConversation.js";
import { getConversation } from "../controllers/conversation.js";
import { console } from "inspector";
const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: "*",
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
            messages:await getupdatedConversation(userId),
            role:userDetails?.role,
            unseenMsg:0,



         
        }
        // console.log(data)
socket.emit("messageUser",data)
    const getConversation=await Conversation.findOne({
    $or:[
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
        ]}).populate('messages').sort({updatedAt:-1})
socket.emit("allMyConversations",getConversation?.messages||[])
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
            ]}).populate('messages').sort({createdAt:-1})
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
const senderConv=await getConversation(data?.sender)
const receiverConv=await getConversation(data?.receiver)
io.to(data?.sender).emit("conversation",senderConv)
io.to(data?.receiver).emit("conversation",receiverConv)

})
socket.on("sidebar", async(userId) => {
       console.log(userId)
        const conversation=await getConversation(userId)
   socket.emit("conversation",conversation)
 })
    
socket.on("seen",async (msgByUser) => {    
    // try{   
       let conversation=await Conversation.findOne({
        $or:[
            {sender:user?._id,receiver:msgByUser},
            {sender:msgByUser,receiver:user?._id}
        ]})//.populate('messages')
      const  convMessagesId=conversation?.messages||[]
        await Message?.updateMany({
            _id:{$in:convMessagesId},
            msgByUser:msgByUser,
    },{
        $set:{ seen:true}
    })
    //send conversation to frontend
const senderConv=await getConversation(user?._id.toString())
const receiverConv=await getConversation(msgByUser)
io.to(user?._id).emit("conversation",senderConv)
io.to(msgByUser).emit("conversation",receiverConv)
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
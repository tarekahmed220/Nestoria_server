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
import { fetchChats, getChatsForUser } from "../controllers/chatController.js";
const app = express();
const server = http.createServer(app);


const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4200",
  "https://nestoria-workshop-front.vercel.app/",
  "https://nestoria-user-front.vercel.app",
];


 
const io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
        methods: ["GET", "POST"],
        
    },
});
const onlineUsers = new Set();
io.on("connection", (socket) => {
  // console.log("Received userData:", userData);
 
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
      console.log("Received userData:", userData);
      if (!userData || !userData._id) {
        console.error("Invalid userData:", userData);
        return;
      }
     
      socket.join(userData._id);
    
    // إضافة المستخدم إلى قائمة المتصلين
    onlineUsers.add(userData._id);

    // إرسال حالة الاتصال لجميع المستخدمين
    io.emit("onlineUsers", Array.from(onlineUsers));
      socket.emit("connected");
    });
    socket.on("new message", async (newMessageReceived) => {
      const chat = newMessageReceived.chat;
      console.log("New message received:", newMessageReceived);
      if (!chat) {
        console.log("chat.users not defined");
        return;
      }
    
      socket.to(chat._id).emit("receive message", newMessageReceived);
      console.log("Chat data:", newMessageReceived.chat);
      // تحديث قائمة المحادثات لكل مستخدم مشارك في المحادثة
      chat.users.forEach(async (user) => {
        if (newMessageReceived.sender && user._id === newMessageReceived.sender._id) {
          return; // لا نرسل للمستخدم المرسل نفسه
        }
    
        try {
          // جلب الدردشات المحدثة لكل مستخدم
          const updatedChats = await getChatsForUser(user._id);
          console.log("Updated chats:", updatedChats);
          // إرسال التحديثات للمستخدم
          socket.in(user._id).emit("refresh chats", updatedChats);
        } catch (error) {
          console.log("Error fetching chats for user:", error);
        }
      });
    });
    
    socket.on("join chat", (room) => {
      console.log(`User ${socket.id} joined room ${room}`); 
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
   




    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      // onlineUsers?.delete(user?._id?.toString());
      io.emit("onlineUsers", Array.from(onlineUsers));
      socket.leave(userData._id);
    });

    
socket.on("disconnect", async() => {
        console.log("disconnected")
        onlineUsers.forEach((user)=>{
          if (Array.from(onlineUsers).includes(user?._id?.toString())) {
            onlineUsers?.delete(user?._id?.toString());
  }  })
    io.emit("onlineUsers", Array.from(onlineUsers));
    })
    

});

export {app,server}
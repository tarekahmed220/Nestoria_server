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
io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });

    
socket.on("disconnect", async() => {
        console.log("disconnected")
    
    })
    

});

export {app,server}
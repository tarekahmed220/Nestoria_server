import mongoose ,{Schema,model}from "mongoose"


import validator from 'validator'
const messageSchema=new Schema({
   
      sender: { type: mongoose.Schema.ObjectId, ref: "User" },
      content: { type: String, trim: true },
      photo: { type: String, default: "" },
      chat: { type: mongoose.Schema.ObjectId, ref: "Chat" },
      readBy: [{ type: mongoose.Schema.ObjectId, ref: "User" }],//array of group users
      cloudinary_id: { type: String },
    },
    {
        timestamps:true
        ,toJSON:{virtuals:true}},
    {toObject:{virtuals:true}}
    );
   //virtual populate
  
        
    export  const Message = model('Message',messageSchema);
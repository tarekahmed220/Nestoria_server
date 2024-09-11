import mongoose ,{Schema,model}from "mongoose"


import validator from 'validator'
const conversationSchema=new Schema({
      text:{
           type:String,
           trim:true
      },
    
      messages:[ {
        type:mongoose.Schema.ObjectId,
        ref:'Message',
      }]
      ,
        sender:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            require:[true,"conversation must belong to user"]
        },
        receiver:{
            
            type:mongoose.Schema.ObjectId,
            ref:'User',
            require:[true,"conversation must belong to user"]
        }
    },
    {
        timestamps:true
        ,toJSON:{virtuals:true}},
    {toObject:{virtuals:true}}
    );
   //virtual populate
  
        
    export  const Conversation = model('Conversation',conversationSchema);
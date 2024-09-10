import mongoose ,{Schema,model}from "mongoose"


import validator from 'validator'
const messageSchema=new Schema({
      text:{
           type:String,
           trim:true
      },
      photo:{
        type:String,
        default:""
      
      },
      seen:{
        type:Boolean,
        default:false
      },
        user:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            
        }
    },
    {
        timestamps:true
        ,toJSON:{virtuals:true}},
    {toObject:{virtuals:true}}
    );
   //virtual populate
  
        
    export  const Message = model('Message',messageSchema);
import { Conversation } from "../models/conversationModel.js";
const getAllMyConversations= async(userId)=>{
    
try{
const conversations=await Conversation.find({
    $or:[
        {sender:userId},
        {receiver:userId}
        ]}).populate('messages').sort({createdAt:-1})
        return conversations || []}
        catch(err){console.log(err)}
// socket.emit("allMyConversations",getAllMyConversations?.messages||[])
    }
    export {getAllMyConversations}
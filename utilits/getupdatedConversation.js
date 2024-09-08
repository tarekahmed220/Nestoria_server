import { Conversation } from "../models/conversationModel.js"

const getupdatedConversation=async(userId)=>{
    if(userId){
        const userConv=await Conversation.find({
            $or:[
                {sender:userId},
                {receiver:userId}
            ]
        })
        .populate('messages sender receiver')
        .sort({createdAt:-1})
       const conversation=userConv?.map((conv)=>{
        const countUnseenMsg= conv?.messages?.reduce((prev,msg)=>{
        const msgByUserId= msg?.msgByUser?.toString()
        if( msgByUserId!==userId){
        return prev + (msg?.seen ? 0 : 1)}
        else{
            return prev
        }},0)
        
        return {
            _id:conv?._id,
            sender:conv?.sender,
            receiver:conv?.receiver,
            // messages:conv?.messages,
            unseenMsg:countUnseenMsg,
            LastMessage:conv?.messages?.length
            ?
            conv?.messages[conv?.messages?.length-1]:null
        }
    })

    return conversation
}else{
    return []
}
}
export default getupdatedConversation
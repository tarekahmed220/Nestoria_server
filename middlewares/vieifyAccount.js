import AppError from "../handleErrors/appError.js";
import {User}  from "../models/userModel.js";
import jwt from 'jsonwebtoken'
const verifyAccount=(req, res,next) => {
    jwt.verify(req.params.token,"furnitureapp",async(err,decoded)=>{
      if(err) return next(new AppError("invalid token",400))
        //return res.status(400).json({msg:"invalid token"});
       
      await User.findOneAndUpdate({email:decoded},{isConfirm:true})
      res.json({msg:" verified email"})

   })
  }
  export default verifyAccount
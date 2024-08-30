import {User} from '../models/userModel.js'
import jwt, { decode } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import catchAsync from "../handleErrors/catchAsync.js"
import AppError from '../handleErrors/appError.js'
import  sendEmail  from "../middlewares/sendEmail.js";
const signToken = (id,role) => {
  return jwt
      .sign({ id,role},
      "furnitureapp" ,
      {expiresIn:"100d"},);
  };
  const createSendToken = (user, statusCode, res) => {
      const token = signToken(user._id,user.role);
      res.status(statusCode).json({
          status: 'success',
          token,
          data: {
            user
          }

      });
  }

const login=catchAsync(async(req,res,next)=>{
    const {email,password}= req.body;
    
        if(!email || !password){
          return next(new AppError('please provide email and password',400));

        }
    const user = await User.findOne({ email }).select('+password');//password.slect=true
        
   if (!user)// || !(await user.correctPassword(password, user.password))) 
    {
   return next(new AppError('Incorrect email or password', 401));

    }
    // user.password=undefined
    //   let token=user.genAuthToken()
    //   // 3) If everything ok, create and send token to client
    //   res.status(200).json({
    //     data:user,
    //    token
    //   });
  createSendToken(user, 200, res);
}); 

const signup=catchAsync(async(req, res) => {
   
  let user= await User.insertMany(req.body)
   // const user =  new User(req.body);
   // const addedUser= await User.save()
   let token = jwt.sign({ email: user[0].email }, "furnitureapp");
   user[0].password=undefined
   user[0].passwordConfirm=undefined
   sendEmail(user[0].email)
    res.status(201).json({
         message: "User Registered Successfully",
         token,
       });
      
      
})

 
export {login,signup}

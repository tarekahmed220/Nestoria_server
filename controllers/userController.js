import {User} from '../models/userModel.js'

import catchAsync from "../handleErrors/catchAsync.js"
//get all users
const getUsers=catchAsync(async(req, res) => {
    let users=await User.find()
    res.status(200).json({msg:"success",users})
    })
//get user by id
const getOneUser=catchAsync(async(req, res) => {
        let userId=req.params.id
        let user=await User.findById(userId).populate('myCart')
      if(!user){
        return next(new AppError("not found user",401))
      }
          res.status(200).json({msg:"success",user})
    })
const getMyProfile=catchAsync(async(req, res) => {
    let userId=req.user.id      
    let user=await User.findById(userId)//.populate('myCart')
    res.status(200).json({msg:"success",user})
  })
  const searchbyEmailOrName = catchAsync(async (req, res) => {
    const { fullName } = req.body;
  
    if (!fullName) {
      return res.status(400).json({ msg: "Search term is required" });
    }
    // const query = new RegExp(`^${search}`, 'i'); 
 
    // Find users by email or name, excluding the password field
    const users = await User.find({
      fullName:{
      $regex:`^${fullName}`, $options:'i' 
  }}).select('-password');
  
    if (!users || users.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }
    res.status(200).json({ msg: "Success", users });
  });
  
    export {
        getUsers,
        getOneUser,
        getMyProfile,
        searchbyEmailOrName
    }
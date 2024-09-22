import catchAsync from '../handleErrors/catchAsync.js';
import AppError from '../handleErrors/appError.js'
 import jwt from 'jsonwebtoken'
 import promisify from "express"
 import util from "util"
 import { User } from '../models/userModel.js';

 const getUserByToken= async (token) => {
    if (!token) {
         console.log('You are not logged in! Please log in to get access.')
        return null;
      }
try{
    const decoded = jwt.verify(token, "furnitureapp");
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found for the provided token');
      return null;
    }
    return user
  } catch (err) {
    console.log("JWT verification failed", err);
    return null; // Return null if the token is invalid
}
   
 }
export default getUserByToken

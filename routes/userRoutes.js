import express from "express";
// import emailCheck from "../middlware/emailCheck.js"
import verifyToken from "../middlewares/verifyToken.js"
import roleCheck from "../middlewares/roleCheck.js"
import {AddProductToCart} from "../controllers/cartController.js"
import {
    getUsers,
    getOneUser
  
    //  verifyAccount
    } from "../controllers/userController.js"
const router=express.Router()
 router.get('/', roleCheck('admin'),getUsers); 
 router.get('/:id', getOneUser); 

 router.route('/:productId/ratings')
 router.patch('/add/:productId',verifyToken
    ,AddProductToCart)
//  .post(
//      verifyToken,
//      restrictTo('client'),
//      createOneRate)
// router.patch('/:id',updateUser);
// router.delete('/:id',deleteUser);


// router.get('/verify/:token', verifyAccount)
export default router;
import express from "express";
// import emailCheck from "../middlware/emailCheck.js"
import verifyToken from "../middlewares/verifyToken.js"
import roleCheck from "../middlewares/roleCheck.js"
import  verifyAccount  from "../middlewares/vieifyAccount.js";
import {AddProductToCart,removeProductFromCart,getCart} from "../controllers/cartController.js"
import {
    getUsers,
    getOneUser
  
    //  verifyAccount
    } from "../controllers/userController.js"
const router=express.Router()
//  router.get('/', roleCheck('admin'),getUsers); 
 router.get('/cart',verifyToken,getCart)
 router.get('/:id', getOneUser); 

 router.route('/:productId/ratings')

 router.patch('/add/:productId',verifyToken
    ,AddProductToCart)
router.patch('/remove/:id',verifyToken
        ,removeProductFromCart)   




router.get('/verify/:token', verifyAccount)
export default router;
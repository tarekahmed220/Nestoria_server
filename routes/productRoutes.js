
import express from "express";
import  verifyToken from "../middlewares/verifyToken.js";
import roleCheck from"../middlewares/roleCheck.js"
import { Rating } from "../models/ratingModel.js";
import { Product } from "../models/productModel.js";
 import {upload} from "../uploads/multer.js"
import path from 'path'
import {
    
    getAllProducts,
    createOneProduct,
    deleteProduct,
    getOneProduct,
    updateProduct,
    
  } from "../controllers/productController.js"
import { createOneRate } from "../controllers/ratingController.js";
const router=express.Router()




    router.route('/').post(upload.single('photo'), createOneProduct)
     router.route('/').get(getAllProducts)

    router
    .route('/:id')
    .delete( deleteProduct)
    .get(getOneProduct)
    .patch(upload.single("photo"),updateProduct)


router
.route('/:productId/ratings')
.post(
    verifyToken,
    roleCheck('client'),
    createOneRate)
export default router;
//products/:productId/rating
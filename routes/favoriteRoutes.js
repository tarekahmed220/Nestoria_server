import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import roleCheck from"../middlewares/roleCheck.js"
import {

    getAllFavorites,
    createOneFavorite,
  } from "../controllers/favoriteController.js"
const router=express.Router()
router
    .route('/:productId').post(verifyToken,roleCheck('client'),createOneFavorite);
   
export default router;
 // .get(verifyToken,roleCheck('client'),getAllFavorites)
    
// router.post('/signup',signup);

// router.get('/verify/:token', verifyAccount)
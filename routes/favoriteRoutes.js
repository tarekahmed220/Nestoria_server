import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import roleCheck from"../middlewares/roleCheck.js"
import {
  deleteOneFavorite,
    getAllFavorites,
    createOneFavorite,
  } from "../controllers/favoriteController.js"
const router=express.Router()
router.route('/:productId').post(verifyToken,roleCheck('client'),createOneFavorite);
router.route('/:productId').delete(verifyToken,roleCheck('client'),deleteOneFavorite)
router.route('/').get(verifyToken,roleCheck('client'),getAllFavorites)   
export default router;

    


// router.get('/verify/:token', verifyAccount)
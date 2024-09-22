import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import roleCheck from"../middlewares/roleCheck.js"
import {

    getAllRatings,
    createOneRate,
  } from "../controllers/ratingController.js"
const router=express.Router()
router
    .route('/')
    .get(getAllRatings)
    .post(verifyToken,roleCheck('client'),createOneRate);
// router.post('/signup',signup);

// router.get('/verify/:token', verifyAccount)
export default router;
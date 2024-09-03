import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import roleCheck from "../middlewares/roleCheck.js";
import { Rating } from "../models/ratingModel.js";
import { Product } from "../models/productModel.js";
import { upload } from "../uploads/multer.js";
import path from "path";
import {

    
    getAllProducts,
    getHomeProducts,
    deleteProduct,
    getOneProduct,
    updateProduct,
    create1
  } from "../controllers/productController.js"
  import {

    
    createOneFavorite,
  } from "../controllers/favoriteController.js"
import { createOneRate } from "../controllers/ratingController.js";
const router = express.Router();

router.route("/cloud").post(verifyToken, upload.single("photo"), create1);
// router.route('/').post(upload.single('photo'), createOneProduct)
router.route("/").get(getAllProducts);
router.route("/homeproducts").get(getHomeProducts);

router
  .route("/:id")
  .delete(deleteProduct)
  .get(getOneProduct)
  .patch(upload.single("photo"), updateProduct);

router

.route('/:productId/ratings')
.post(
    verifyToken,
    roleCheck('client'),
    createOneRate)
router
.route('/:productId/favorites')
.patch(
    verifyToken,
    roleCheck('client'),
    createOneFavorite)
export default router;
//products/:productId/rating

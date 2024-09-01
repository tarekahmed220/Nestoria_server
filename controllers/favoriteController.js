import { Favorite } from "../models/favoriteModel.js";
import catchAsync from "../handleErrors/catchAsync.js"
import AppError from "../handleErrors/appError.js"
//get all Rating
const getAllFavorites=catchAsync(async(req, res) => {
    const favorites=await Favorite.find({user:req.user.id})
   
    res.status(200).json({
        msg:"success",
        length:favorites.length,
        data:{favorites}})
    })






 
const createOneFavorite = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;
  req.body.product = req.body.product || productId;
  req.body.user = req.body.user || req.user.id;
  if (!req.body.product) {
      return next(new AppError("Product ID is required", 400));
  }

  const existingFavorite = await Favorite.findOne({ user: req.user.id, product: req.body.product });
  if (existingFavorite) {
      return next(new AppError("Product is already in your wishlist", 400));
  }
  const newFavorite = await Favorite.create({
      user: req.user.id,
      product: req.body.product,
      is_favorite: true
  });

  res.status(200).json({
      msg: "success",
      data: { newFavorite }
  });
});
 
const deleteOneFavorite = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;
  req.body.product = req.body.product || productId;
  req.body.user = req.body.user || req.user.id;
  if (!req.body.product) {
      return next(new AppError("Product ID is required", 400));
  }

  const existingFavorite = await Favorite.findOne({ user: req.user.id, product: req.body.product });
  if (!existingFavorite) {
      return next(new AppError("Product is not in your wishlist", 400));
  }
  await Favorite.deleteOne({ user: req.user.id, product: productId });
  res.status(200).json({
      msg: "success",
      
  });
});
 export {getAllFavorites,createOneFavorite,deleteOneFavorite}  
 /**
  * exports.getAllOffers = catchAsync(async (req, res,next) => { 
  //no need to populate in this function cause will noe use them 
  const offers = await Offer.find();
  if (!offers)  { 
    return next(new AppError(
      "can't get  offers" ,404));
  } 
    res 
      .status(200) 
      .json({ status: "success", 
      length: offers.length,
       data: {offers},
      }); 
  
});
exports.addOffer = catchAsync(async (req, res,next) => { 
  const {text,status}=req.body;
  const {orderId}=req.params;
  const orderFound = await Order.findById(orderId).populate("offers");
  if (!orderFound) { 
    return next(new AppError(
      " order not found " ,404));
  } 

const hasOffered = orderFound?.offers?.find((offer) => {//user=worker//
  
  return offer.worker.id === req.user.id;
 
  });
  
  if (hasOffered) {
    return next(new AppError("You have already added your offer",404));
  }
//create review
const offer = await Offer.create({
  text,
  status,
  order:orderFound?._id,
  worker:req.user.id,
});
//Push offer into order Found
orderFound.offers.push(offer?._id);
//resave
await orderFound.save();  

    res.status(201)
    .json({
       status: "success", 
       data: offer }) 
  }); 
  */
 
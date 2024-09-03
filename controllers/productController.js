import AppError from "../handleErrors/appError.js";
import catchAsync from "../handleErrors/catchAsync.js";
import { Product } from "../models/productModel.js";
import { upload } from "../uploads/multer.js";
import { deleteOne } from "./factory.js";
import { cloudinary } from "../uploads/cloudinary.js";
import { HomeProductsModel } from "../models/homeProductModel.js";

const create1 = catchAsync(async (req, res) => {
  //allowed nested routes

  if (!req.body.user) req.body.user = req.user.id; //from protect middleware

  const { productName, price, description, category } = req.body;

  //Upload image to cloudinary

  const result = await cloudinary.v2.uploader.upload(req.file.path);

  //create order
  const product = await Product.create({
    productName,
    price,

    category,
    description,
    photo: result.secure_url,
    cloudinary_id: result.public_id,

    user: req.user.id,
  });

  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });


    //get product by id
    const getAllProducts=catchAsync(async(req, res,next) => {
    
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
    
        const startIndex = (page - 1) * limit;
        const total = await Product.countDocuments();
    
        const products = await Product.find().sort({createdAt:-1}).skip(startIndex).limit(limit);
    
        res.status(200).json({
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            data: products
        });
    });
const getOneProduct=catchAsync(async(req,res,next)=>{
    const productId=req.params.id
    let product =await Product.findById(productId).populate('ratings')
    if(!product){
        return next(new AppError("product not found",404))
    }
    res.status(200).json({status:"success",data:{product}})
})
const deleteProduct=catchAsync(async(req,res,next)=>{
    const product=await Product.findById(req.params.id)
    if(!product){
        return next(new AppError("product not found",404))
    }
    const deletedProduct=await Product.findByIdAndDelete(product)
    res.status(204).json({status:"success",data:null})
})

const updateProduct=catchAsync(async(req,res,next)=>{
    const productId=req.params.id
    let product =await Product.findById(productId)
    if(!product){
        return next(new AppError("product not found",404))
    }
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    if (req.file) { req.body.photo=result.secure_url;}
    const updatedOne= await Product.findByIdAndUpdate(
        req.params.id, req.body,{
            new: true,
            runValidators: true
          });
    res.status(200).json({status:"success",data:{updatedOne}})

})

// get home products

const getHomeProducts = catchAsync(async (req, res, next) => {
  const homeProducts = await HomeProductsModel.find().sort({ createdAt: -1 });

  res.status(200).json([{ msg: "success" }, { homeProducts }]);
});

export{
    getAllProducts,
    
    getOneProduct,
    deleteProduct,
    updateProduct,
    create1,
     getHomeProducts,
}


  


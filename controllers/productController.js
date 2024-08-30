import AppError from "../handleErrors/appError.js";
import catchAsync from "../handleErrors/catchAsync.js";
import { Product } from "../models/productModel.js";
import { upload } from "../uploads/multer.js";
import { deleteOne } from "./factory.js";
import { cloudinary } from "../uploads/cloudinary.js";



const create1 = catchAsync(async (req, res) => {
    //allowed nested routes
    
    if (!req.body.user) req.body.user = req.user.id;//from protect middleware
    
    const {productName,price,description,category} = req.body;
    
  
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
      
      user:req.user.id,
   
    });
    
    res.status(201).json({
      status:"success",
     data:{
      product,
     }
    });
    
  });
  
// create
const createOneProduct = catchAsync(async (req, res, next) => {
    const { productName, price,  description ,category} = req.body;
    // Ensure required fields are present
    if (!productName || !price || !description||!category) {
        return next(new AppError('Product name, price, and description are required', 400));
    }
    if(!req.file){
        return next(new AppError('product Photo are required', 500));
    }
      
        const photo= `http://localhost:5000/uploads/${req.file?.filename}`;
    const newProduct = await Product.create({ productName, price,category, description ,photo});
    console.log(newProduct)
    res.status(200).json({
        msg: "success",
        data: newProduct,
        
    });

});

    //get all products
const getAllProducts=catchAsync(async(req, res,next) => {

 
      
        const products = await Product.find().sort({createdAt:-1})
    
  

       res.status(200).json([{msg:"success"},{products}])
    })
    //get product by id
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
    if (req.file) { req.body.photo=`http://localhost:5000/uploads/${req.file?.filename}`;}
    const updatedOne= await Product.findByIdAndUpdate(
        req.params.id, req.body,{
            new: true,
            runValidators: true
          });
    res.status(200).json({status:"success",data:{updatedOne}})

})

export{
    getAllProducts,
    createOneProduct,
    getOneProduct,
    deleteProduct,
    updateProduct,
    create1
    
}


  
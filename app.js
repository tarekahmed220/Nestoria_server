
import "dotenv/config"
import express from'express';
import {dbConnect}  from './dbConnect.js'
import { Product } from './models/productModel.js';
import AppError from './handleErrors/appError.js';
import globalErrorHandler from './handleErrors/globalError.js';
import mongoose from 'mongoose';//{ MongoClient } from "mongodb";
 import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
 import authRoutes from './routes/authRoutes.js'
 import ratingRoutes from './routes/ratingRoutes.js'
import productRoutes from './routes/productRoutes.js'
import favoriteRoutes from './routes/favoriteRoutes.js'

import conversationRoute from './routes/conversationRoute.js'
import {app,server} from './socket/index.js'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


import { dirname } from 'path';


 import path from 'path';


const __dirname = path.resolve();
// const app = express();



app.use(cors({origin:"http://localhost:3000",credentials:true})) 
app.use(express.json());

// app.use(express.static(__dirname + "../uploads"));//work with react//
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


dbConnect()
 
//test middleware
app.use((req,res,next)=>{
    req.requestTime=new Date().toISOString()
    next()
})

  


 app.use('/api/v1/fur/auth',authRoutes);
 app.use('/api/v1/fur/users',userRoutes);
 app.use('/api/v1/fur/rates',ratingRoutes);
 app.use('/api/v1/fur/favorites', favoriteRoutes);
 app.use('/api/v1/fur/chat',conversationRoute);

 app.use('/api/v1/fur/products',productRoutes);


 app.all('*', (req, res, next) => {
    return next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));//update here by return//class AppError extends Error
  });
//exports.ErrorRequestHandler if next function is error
app.use(globalErrorHandler)


server.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
export default app;
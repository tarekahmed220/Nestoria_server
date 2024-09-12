import mongoose ,{Schema,model}from "mongoose"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import validator from 'validator'
const userSchema=new Schema({
    fullName:{
        type: String,
        required: [true, 'Please tell us your name!'],
        trim:true,
        minlength:3,
        maxlength:30,
      },
   
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: [true,'the email is exist already'],
        lowercase: true,
        trim:true,
        min:8,
        max:200,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    address:{
        type: String,
        required: [true, 'Please provide your address'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        maxlength:250,
        select:false,
        trim:true,
      },
      passwordConfirm:{
        type: String,
        required: [true, 'Please confirm a password'],
        minlength: 8,
        maxlength:50,
        trim:true,
        select:false,
        // validate:function(e){
        //   return e===this.password
        // },
        // Message:"passwordes are not the same"
      },
    photo:{   
         type: String,
         default:"",
        }
        ,
    phone:{
        type:String,
        minlength:9,
        maxlength:50,
    required:[true,"please"]},
    isLoggedin:{
        type:Boolean,
        default:true,
    },
   myCart:[{
    type:mongoose.Schema.ObjectId,
    ref:'Product',
  
   }],
    role:{
        type:String,
        enum:['admin','client','workshop'],
        default:"client",
    },//email
    isConfirm:{
      type:Boolean,
      default:false
    },
    passwordResetToken:String,
    passwordResetExpires:Date,
    passwordChangedAt:Date
   
},{
  timestamps:true,
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
},)
// userSchema.pre('save', async function(next) {
//     // Only run this function if password was actually modified
//     if (!this.isModified('password')) return next();
//     // Hash the password with cost of 8
    
//     this.password = await bcrypt.hash(this.password, 8);//8=salt bcrypt
    
//     this.passwordConfirm = undefined;
//     next();
//   });
  
 
 
  userSchema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({ isLoggedin: { $ne: false } });
    next();
  });
  userSchema.methods.correctPassword = async function( passwordCurrent, userPassword) {
    return await bcrypt.compare(passwordCurrent, userPassword);
  };
 
  userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
      return JWTTimestamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
  };
  
export const User=model("User",userSchema)
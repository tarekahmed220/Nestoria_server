
import {User} from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import catchAsync from "../handleErrors/catchAsync.js"
import AppError from '../handleErrors/appError.js'
import  sendEmail  from "../middlewares/sendEmail.js";
import crypto from 'crypto';
import sendEmail2 from '../middlewares/email2.js'
const signToken = (id,role) => {
  return jwt
      .sign({ id,role},
      "furnitureapp", 
      {expiresIn:"100d"},);
  };
  const createSendToken = (user, statusCode, res) => {
      const token = signToken(user._id,user.role);
      res.status(statusCode).json({
          status: 'success',
          token,
          data: {
            user
          }

      });
  }


const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
      console.log("User not found with the provided email.");
      return next(new AppError("Incorrect email or password", 422));
  }

  const isPasswordCorrect = bcrypt.compareSync(password, user.password);
  

  if (!isPasswordCorrect) {
      return next(new AppError("Incorrect email or password", 422));
  }

  if (user.isConfirm === false) {
      return next(new AppError("You should verify your account, check your email", 401));
  }

  createSendToken(user, 200, res);
});



const signup = catchAsync(async (req, res, next) => {
      let userfound=await User.findOne({email:req.body.email})
      if(userfound){return next(new AppError("already has an account",422))}
      
   
    if (req.body.password !== req.body.passwordConfirm) {
      return next(new AppError('Passwords do not match', 400));
    }
    let password = bcrypt.hashSync(req.body.password, 8);
    let confirm=req.body.passwordConfirm
    req.body.passwordConfirm=undefined
    const user = new User({
      fullName:req.body.fullName,
      email:req.body.email,
      role:req.body.role,
      phone:req.body.phone,
      address:req.body.address,
      password,
      passwordConfirm:confirm});
      
      
      await user.save();
    const token = jwt.sign({ email: user.email }, "furnitureapp", { expiresIn: "100d" }); // sign
    // user[0].password = undefined;
    //  user.passwordConfirm=undefined
    try {
      await sendEmail(user.email);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      
    }
    res.status(201).json({
      message: "User Registered Successfully",
      token,
     
    });
 
});

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // 3) Hash the token and set it on the user model
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

  await user.save({ validateBeforeSave: false });

  // 4) Create reset URL
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/ng/auth/resetPassword/${resetToken}`;

  const message = `PATCH request with your new password to: ${resetURL}.`;

  // 5) Send it to user's email
  try {
    await sendEmail2({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
});
const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Hash the token from the request
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  // 2) Find the user based on the hashed token and expiration date
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  // 3) If token has not expired and there is a user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  // 4) Set new password and confirm password
  let password = bcrypt.hashSync(req.body.password, 8);
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // 5) Save the user with the new password
  await user.save();
  // 6) Log the user in, send JWT
  createSendToken(user, 200, res);
});
export {login,signup,forgotPassword,resetPassword}
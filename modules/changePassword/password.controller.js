import catchAsync from "../../handleErrors/catchAsync.js";
import { User } from "../../models/userModel.js";
import bcrypt from "bcryptjs";


const updatePassword = catchAsync(async function(req,res){
  const userId = req.user.id;
  const currentPassword = req.body.currentPassword;  
  const newPassword = req.body.newPassword;
  let confirmNewPassword = req.body.confirmNewPassword;
  console.log(currentPassword,newPassword,confirmNewPassword);
  

  const user = await User.findById(userId).select("+password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  if(!currentPassword){
    return res.json({ message: "Enter password" });
  }
  if(!newPassword){
    return res.json({message: "Enter new password"});
  }
  if(!confirmNewPassword){
    return res.json({message: "Enter confirm new password"});
  }

  const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);

  if(isPasswordCorrect){
    if(newPassword === confirmNewPassword){
      user.password = bcrypt.hashSync(newPassword, 8);
      confirmNewPassword = undefined;
      await user.save();
      res.status(200).json({ message: "Password updated" });
      console.log("done");
      
    }else{
      res.json({message: "password not match"});
    }
    res.status(200).json({ message: "Password is correct" });
  }else{
    res.status(400).json({ message: "Incorrect password" });
  }
})

export {
  updatePassword,
}
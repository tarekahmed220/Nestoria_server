import catchAsync from "../../handleErrors/catchAsync.js";
import { User } from "../../models/userModel.js";
import bcrypt from "bcryptjs";

const updateAccount = catchAsync(async function (req, res) {
  const userId = req.user.id;
  const fullName = req.body.fullName;
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  let confirmNewPassword = req.body.confirmNewPassword;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\*\@\%\$\#]).{8,30}$/;
  const regexName = /^[a-zA-Z][a-zA-Z ]{2,30}$/;

  const user = await User.findById(userId).select("+password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (fullName !== user.fullName) {
    if (!regexName.test(fullName)) return res.json({ message: "Enter valid full name" });
    if (!currentPassword) return res.json({ message: "Enter password" });
  }
  if (newPassword) {
    if (!passwordRegex.test(newPassword))
      return res.json({
        message: "use upper, lower, digit, and special char from @ # % $",
      });
    if (!confirmNewPassword) {
      return res.json({ message: "Enter confirm new password" });
    }
    if (newPassword !== confirmNewPassword) {
      return res.json({
        message: "New password confirmation must match the new password",
      });
    }
  }

  const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);

  if (isPasswordCorrect) {
    if (newPassword) {
      if (fullName === user.fullName) {
        user.password = bcrypt.hashSync(newPassword, 8);
        confirmNewPassword = undefined;
        await user.save();
        res.status(200).json({ message: "Password updated" });
      } else{
        user.fullName = fullName;
        user.password = bcrypt.hashSync(newPassword, 8);
        confirmNewPassword = undefined;
        await user.save();
        res.status(200).json({ message: "Account updated" });
      }
    }else{
      if (fullName !== user.fullName) {
        user.fullName = fullName;
        await user.save();
        res.status(200).json({ message: "Full name updated" });
      } else {
        res.json({ message: "Full name not change" });
      }
    }
  } else {
    res.status(400).json({ message: "Incorrect password" });
  }
});

export { updateAccount };
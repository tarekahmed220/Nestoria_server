import AppError from "../handleErrors/appError.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

const verifyAccount = (req, res, next) => {
  jwt.verify(req.params.token, "furnitureapp", async (err, decoded) => {
    if (err) return next(new AppError("Invalid token", 400));
    const email = decoded;
    // Update the user's isConfirm field
    const user = await User.findOneAndUpdate({ email }, { isConfirm: true });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.json({ msg: "Verified email" });
  });
};

export default verifyAccount;

import AppError from "../handleErrors/appError.js";
const roleCheck = (...roles) => {
  return (req, res, next) => {
    //role=['admin','client','worker']

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
export default roleCheck;

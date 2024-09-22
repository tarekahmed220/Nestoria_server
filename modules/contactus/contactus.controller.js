import catchAsync from "../../handleErrors/catchAsync.js";
import contactusModel from "../../models/contactus.model.js";

const addProblem = catchAsync(async function (req, res) {
  const { userName, userMobile, userEmail, userProblem } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.json("User not logged in");
  }
  if (!userName || !userMobile || !userEmail || !userProblem) {
    return res.json("Enter full data");
  }
  const newProblem = new contactusModel({
    userId,
    userName,
    userMobile,
    userEmail,
    userProblem,
  });
  await newProblem.save();
  res.json(newProblem);
});

export { addProblem };

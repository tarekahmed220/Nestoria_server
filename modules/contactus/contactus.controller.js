import catchAsync from "../../handleErrors/catchAsync.js";
import contactusModel from "../../models/contactus.model.js";
import autoReplyEmail from "../../middlewares/autoReplyEmail.js";

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
  autoReplyEmail(userEmail, userName);
  res.json(newProblem);
});

const getCustomerComplaints = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 5, category } = req.query;
  console.log(category);
  const offset = (page - 1) * limit;

  const condition = {};
  if (category) {
    condition.problemState = category;
  }

  const complaints = await contactusModel
    .find(condition)
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 });
  const complaintsNumbers = await contactusModel.countDocuments(condition);
  if (!complaints) {
    return res.json({
      message: "Sorry, you don't have any Complaints Yet",
    });
  }

  const totalPages = Math.ceil(complaintsNumbers / limit);

  res.json({
    message: "success",
    complaintsNumbers,
    totalPages,
    complaints,
  });
});

const changeProblemStatus = catchAsync(async (req, res, next) => {
  const { _id } = req.query;
  const targetProblem = await contactusModel.findByIdAndUpdate(
    _id,
    {
      problemState: "solved",
    },
    { new: true }
  );
  res.json({ message: "success", targetProblem });
});

export { addProblem, getCustomerComplaints, changeProblemStatus };

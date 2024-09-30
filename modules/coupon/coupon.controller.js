import catchAsync from "../../handleErrors/catchAsync.js";
import couponModel from "../../models/coupon.model.js";

const createCoupon = catchAsync(async function (req, res) {
  const { couponDetails } = req.body;

  const code = couponDetails.couponCode;
  const discount = couponDetails.couponDiscount;
  const startDate = couponDetails.couponStartDate;
  const endDate = couponDetails.couponEndDate;

  if (!discount || !code || !startDate || !endDate) {
    return res.status(400).json({ message: "Enter info coupon" });
  }
  const codeCoupon = await couponModel.findOne({ code });
  if (codeCoupon) {
    return res
      .status(400)
      .json({ message: "Coupon with this code already exists" });
  }
  const today = new Date().toISOString().split("T")[0];
  const newCoupon = await couponModel.create({
    discount,
    code,
    startDate,
    endDate,
    status: today === startDate && true,
  });
  res.status(201).json({ newCoupon });
});

const deleteCoupon = catchAsync(async function (req, res) {
  const couponId  = req.body.couponId;
  const deleteCoupon = await couponModel.findByIdAndDelete(couponId);
  if (!deleteCoupon)
    return res.status(404).json({ message: "Coupon not found" });
  res.json({ message: "Coupon deleted successfully" });
});

const updateCoupon = catchAsync(async function (req, res) {
  const { couponDetails } = req.body;
  const {couponEdit} = req.body;
  const couponId= couponEdit._id;
  // console.log("edit",couponId);
  // console.log(couponDetails);

  const code = couponDetails.couponCode;
  const discount = couponDetails.couponDiscount;
  const startDate = couponDetails.couponStartDate;
  const endDate = couponDetails.couponEndDate;

  if (!discount || !code || !startDate || !endDate) {
    return res.status(400).json({ message: "Enter info coupon" });
  }
  const today = new Date().toISOString().split("T")[0];
  const updatedCoupon = await couponModel.findByIdAndUpdate(
    couponId,
    { discount, code, startDate, endDate, status: today === startDate ? true : false},
    { new: true, runValidators: true }
  );
  if (!updatedCoupon)
    return res.status(404).json({ message: "Coupon not found" });
  res.json({ updatedCoupon });
});

const updateStatusCoupon = catchAsync(async function (req, res) {
  const { couponId } = req.body;
  if (!couponId) {
    return res.status(400).json({ message: "Enter coupon ID" });
  }
  const coupon = await couponModel.findById(couponId);
  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }
  coupon.status = !coupon.status;
  await coupon.save();
  res.json({
    message: "Status updated",
    status: coupon.status,
  });
});


const getAllCoupons = catchAsync(async function (req, res) {
  const coupons = await couponModel.find();
  res.json({ coupons });
});

// const isCouponExpired = (endDate) => {
//   const today = new Date();
//   const end = new Date(endDate);
//   return end < today; // Returns true if endDate is in the past
// };

// const getAllCoupons = catchAsync(async function (req, res) {
//   // Update the status of coupons that have expired
//   await couponModel.updateMany(
//     { endDate: { $lt: new Date() } }, // Find coupons where endDate is less than today's date
//     { status: false } // Set status to false
//   );

//   // Retrieve all coupons
//   const coupons = await couponModel.find();
//   res.json({ coupons });
// });
export { createCoupon, deleteCoupon, updateCoupon, updateStatusCoupon, getAllCoupons };

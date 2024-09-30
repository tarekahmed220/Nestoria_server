import catchAsync from "../../handleErrors/catchAsync.js";
import couponModel from "../../models/coupon.model.js";

const createCoupon = catchAsync(async function (req, res) {
  const { couponDetails } = req.body;
  console.log(couponDetails);

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
  const newCoupon = await couponModel.create({
    discount,
    code,
    startDate,
    endDate,
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
  console.log("edit",couponId);
  
  console.log(couponDetails);

  const code = couponDetails.couponCode;
  const discount = couponDetails.couponDiscount;
  const startDate = couponDetails.couponStartDate;
  const endDate = couponDetails.couponEndDate;

  if (!discount || !code || !startDate || !endDate) {
    return res.status(400).json({ message: "Enter info coupon" });
  }

  const updatedCoupon = await couponModel.findByIdAndUpdate(
    couponId,
    { discount, code },
    { new: true, runValidators: true }
  );
  if (!updatedCoupon)
    return res.status(404).json({ message: "Coupon not found" });
  res.json({ updatedCoupon });
});

const getAllCoupons = catchAsync(async function (req, res) {
  const coupons = await couponModel.find();
  res.json({ coupons });
});

export { createCoupon, deleteCoupon, updateCoupon, getAllCoupons };

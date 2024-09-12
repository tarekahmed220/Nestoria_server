import catchAsync from "../../handleErrors/catchAsync.js";
import shippingAddressModel from "../../models/shippingAddress.model.js";

const addShippingAddress = catchAsync(async function (req, res) {
  const userId = req.user.id;
  const { company = "", streetAddress, city, state = "", PINCode } = req.body;
  if (!streetAddress.houseNumber || !city || !PINCode) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }
  const existingAddress = await shippingAddressModel.findOne({ userId });
  if (!existingAddress) {
    const addressShipping = new shippingAddressModel({
      userId,
      company,
      streetAddress,
      city,
      state,
      PINCode,
    });
    await addressShipping.save();
    return res.status(201).json({ id: addressShipping._id });
  }
  res.status(400).json({ message: "Address already exists for this user" });
});

const getShippingAddress = catchAsync(async function(req,res){
  const userId = req.user.id;
  const shippingAddressFound = await shippingAddressModel.findOne({userId});
  if(shippingAddressFound){
    res.json(shippingAddressFound);
  }
})

export { addShippingAddress, getShippingAddress };

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

const updateShippingAddress = catchAsync(async function (req, res) {
  const userId = req.user.id;
  const { company, streetAddress, city, state, PINCode } = req.body;
  const shippingAddressFound = await shippingAddressModel.findOne({ userId });
  if (shippingAddressFound) {
    if (
      shippingAddressFound.company === company &&
      shippingAddressFound.streetAddress.houseNumber === streetAddress.houseNumber &&
      shippingAddressFound.streetAddress.apartment === streetAddress.apartment &&
      shippingAddressFound.city === city &&
      shippingAddressFound.state === state &&
      shippingAddressFound.PINCode === PINCode
    ){
      return res.json("No modification");
    }
      if (shippingAddressFound.company !== company) {
        shippingAddressFound.company = company;
      }
    if (shippingAddressFound.streetAddress.houseNumber !== streetAddress.houseNumber) {
      shippingAddressFound.streetAddress.houseNumber = streetAddress.houseNumber;
    }
    if (shippingAddressFound.streetAddress.apartment !== streetAddress.apartment) {
      shippingAddressFound.streetAddress.apartment = streetAddress.apartment;
    }
    if (shippingAddressFound.city !== city) {
      shippingAddressFound.city = city;
    }
    if (shippingAddressFound.state !== state) {
      shippingAddressFound.state = state;
    }
    if (shippingAddressFound.PINCode !== PINCode) {
      shippingAddressFound.PINCode = PINCode;
    }
    await shippingAddressFound.save();
    res.json(shippingAddressFound);
  } else {
    res.json("Not founded address");
  }
});

const getShippingAddress = catchAsync(async function (req, res) {
  const userId = req.user.id;
  const shippingAddressFound = await shippingAddressModel.findOne({ userId });
  if (shippingAddressFound) {
    res.json(shippingAddressFound);
  }
});

export { addShippingAddress, getShippingAddress, updateShippingAddress };

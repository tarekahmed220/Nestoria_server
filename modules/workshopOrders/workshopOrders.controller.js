import catchAsync from "../../handleErrors/catchAsync.js";
import checkoutModel from "../../models/checkout.model.js";

const getOrders = catchAsync(async function (req, res) {
  const workshopId = req.body.id;
  // console.log(workshopId);
  if (!workshopId) {
    return res.status(400).json({ message: "Workshop ID is required" });
  }
  const ordersItems = await checkoutModel
    .find()
    .populate("userId")
    .populate("products.productId");
  // console.log("All Orders Found:", ordersItems.length);
  const validOrders = ordersItems.filter(order => {
    return order.products.some(product => {
      const productWorkshopId = product.productId?.workshop_id?.toString();
      // console.log("Product Workshop ID:", productWorkshopId);
      return productWorkshopId === workshopId;
    });
  });
  if (validOrders.length === 0) {
    return res.status(404).json({ message: "No orders found for this workshop" });
  }
  res.json(validOrders);
});

export { getOrders };

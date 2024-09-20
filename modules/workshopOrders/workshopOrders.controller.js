import catchAsync from "../../handleErrors/catchAsync.js";
import checkoutModel from "../../models/checkout.model.js";


const getValidOrders = async (_id) => {
  const ordersItems = await checkoutModel
    .find()
    .populate("userId")
    .populate("products.productId");

  return ordersItems
    .map((order) => {
      const filteredProducts = order.products.filter((product) => {
        const productWorkshopId = product.productId?.workshop_id?.toString();
        return productWorkshopId === _id.toString();
      });

      if (filteredProducts.length > 0) {
        return {
          ...order.toObject(),
          products: filteredProducts,
        };
      }
      return null;
    })
    .filter((order) => order !== null);
};

const getOrders = catchAsync(async function (req, res) {
  const {_id} = req.user;
  if (!_id) {
    return res.status(400).json({ message: "Workshop ID is required" });
  }

  const validOrders = await getValidOrders(_id);

  if (validOrders.length === 0) {
    return res
      .status(404)
      .json({ message: "No orders found for this workshop" });
  }

  res.json(validOrders);
});

const pendingOrders = catchAsync(async function (req, res) {
  const {_id} = req.user;
  // console.log(_id.toString());
  if (!_id) {
    return res.status(400).json({ message: "Workshop ID is required" });
  }
  const validOrders = await getValidOrders(_id);
  const pending = validOrders.filter((order) =>
    order.products.some((product) => product.deliveryStatus === "Processing")
  );
  if (pending.length === 0) {
    return res
      .status(404)
      .json({ message: "No pending orders found for this workshop" });
  }
  res.json(pending);
});

const shippedOrders = catchAsync(async function (req, res) {
  const {_id} = req.user;

  if (!_id) {
    return res.status(400).json({ message: "Workshop ID is required" });
  }
  const validOrders = await getValidOrders(_id);
  const shipped = validOrders.filter((order) =>
    order.products.some((product) => product.deliveryStatus === "Shipped")
  );
  if (shipped.length === 0) {
    return res.status(200).json({
      message: "No shipped orders found for this workshop",
      orders: [],
    });
  }
  res.json(shipped);
});

const updateOrders = catchAsync(async function (req, res) {
  const {_id} = req.user;
  const productId = req.body.productId;
  const orderId = req.body.orderId;  
  if (!_id) {
    return res.status(400).json({ message: "Workshop ID is required" });
  }
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }
  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  const validOrders = await getValidOrders(_id);

  const order = validOrders.find((order) =>
    order.products.some(
      (product) =>
        product.productId._id.toString() === productId &&
        product._id.toString() === orderId &&
        product.deliveryStatus === "Processing"
    )
  );

  if (!order) {
    return res
      .status(404)
      .json({ message: "No pending product found for this workshop" });
  }

  const productToUpdate = order.products.find(
    (product) =>
      product.productId._id.toString() === productId &&
      product._id.toString() === orderId
  );

  if (productToUpdate) {
    productToUpdate.deliveryStatus = "Shipped";
    await checkoutModel.updateOne(
      { _id: order._id, "products.productId": productId },
      { $set: { "products.$.deliveryStatus": productToUpdate.deliveryStatus } }
    );
    res.json(productToUpdate);
  } else {
    return res.status(404).json({ message: "Product not found in order" });
  }
});

const cancelProduct = catchAsync(async function (req, res) {
  const {_id} = req.user;
  const productId = req.body.productId;
  const orderId = req.body.orderId;

  if (!_id) {
    return res.status(400).json({ message: "Workshop ID is required" });
  }
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }
  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  const validOrders = await getValidOrders(_id);

  const order = validOrders.find((order) =>
    order.products.some(
      (product) =>
        product.productId._id.toString() === productId &&
        product._id.toString() === orderId &&
        product.deliveryStatus !== "Cancelled"
    )
  );

  if (!order) {
    return res
      .status(404)
      .json({ message: "No product found to cancel for this workshop" });
  }

  const productToCancel = order.products.find(
    (product) =>
      product.productId._id.toString() === productId &&
      product._id.toString() === orderId
  );

  if (productToCancel) {
    productToCancel.deliveryStatus = "Cancelled";
    
    await checkoutModel.updateOne(
      { _id: order._id, "products.productId": productId },
      { $set: { "products.$.deliveryStatus": productToCancel.deliveryStatus } }
    );
    
    res.json({ message: "Product cancelled successfully", product: productToCancel });
  } else {
    return res.status(404).json({ message: "Product not found in order" });
  }
});

export { getOrders, pendingOrders, shippedOrders, updateOrders, cancelProduct };

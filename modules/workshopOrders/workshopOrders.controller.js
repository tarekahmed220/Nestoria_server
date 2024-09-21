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
  const { _id } = req.user;

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

// const pendingOrders = catchAsync(async function (req, res) {
//   const { _id } = req.user;
//   if (!_id) {
//     return res.status(400).json({ message: "Workshop ID is required" });
//   }
//   const validOrders = await getValidOrders(_id);
//   const pending = validOrders.filter((order) =>
//     order.products.some((product) => product.deliveryStatus === "Processing")
//   );
//   if (pending.length === 0) {
//     return res
//       .status(404)
//       .json({ message: "No pending orders found for this workshop" });
//   }
//   res.json(pending);
// });

const pendingOrders = catchAsync(async function (req, res) {
  const { _id } = req.user;

  if (!_id) {
    return res.status(400).json({ message: "Workshop ID is required" });
  }
  const validOrders = await getValidOrders(_id);

  const pending = validOrders
    .map((order) => {
      const filteredProducts = order.products.filter(
        (product) => product.deliveryStatus === "Processing"
      );
      return {
        ...order,
        products: filteredProducts,
      };
    })
    .filter((order) => order.products.length > 0);
  if (pending.length === 0) {
    return res
      .status(200)
      .json({
        message: "No pending orders found for this workshop",
        orders: [],
      });
  }
  res.json(pending);
});

const shippedOrders = catchAsync(async function (req, res) {
  const { _id } = req.user;

  if (!_id) {
    return res.status(400).json({ message: "Workshop ID is required" });
  }
  const validOrders = await getValidOrders(_id);
  const shipped = validOrders
    .map((order) => {
      const filteredProducts = order.products.filter(
        (product) => product.deliveryStatus === "Shipped"
      );
      return {
        ...order,
        products: filteredProducts,
      };
    })
    .filter((order) => order.products.length > 0);
  if (shipped.length === 0) {
    return res.status(200).json({
      message: "No shipped orders found for this workshop",
      orders: [],
    });
  }

  res.json(shipped);
});

const updateOrders = catchAsync(async function (req, res) {
  const { _id } = req.user;
  const { productId, orderId, color } = req.body;

  if (!_id) {
    return res.status(400).json({ message: "Workshop ID is required" });
  }
  if (!productId || !orderId || !color) {
    return res
      .status(400)
      .json({ message: "Product ID, Order ID, and Color are required" });
  }
  const validOrders = await getValidOrders(_id);
  let productToUpdate = null;
  const order = validOrders.find((order) =>
    order.products.some((product) => {
      const isMatchingProduct =
        product._id.toString() === productId &&
        order._id.toString() === orderId &&
        product.color === color &&
        product.deliveryStatus === "Processing";
      // console.log("Matching Product Found:", isMatchingProduct);
      if (isMatchingProduct) {
        productToUpdate = product;
      }
      return isMatchingProduct;
    })
  );

  if (!order || !productToUpdate) {
    return res
      .status(404)
      .json({ message: "No pending product found for this workshop" });
  }
  productToUpdate.deliveryStatus = "Shipped";
  await checkoutModel.updateOne(
    {
      _id: order._id,
      "products._id": productId,
      "products.color": color,
    },
    { $set: { "products.$.deliveryStatus": productToUpdate.deliveryStatus } }
  );
  res.json({ message: "Product shipped successfully", productToUpdate });
});

const cancelProduct = catchAsync(async function (req, res) {
  const { _id } = req.user;
  const { productId, orderId, color } = req.body;

  if (!_id) {
    return res.status(400).json({ message: "Workshop ID is required" });
  }
  if (!productId || !orderId || !color) {
    return res
      .status(400)
      .json({ message: "Product ID, Order ID, and Color are required" });
  }
  const validOrders = await getValidOrders(_id);
  let productToCancel = null;
  const order = validOrders.find((order) =>
    order.products.some((product) => {
      const isMatchingProduct =
        product._id.toString() === productId &&
        order._id.toString() === orderId &&
        product.color === color &&
        product.deliveryStatus !== "Cancelled";
      // console.log("Matching Product Found:", isMatchingProduct);
      if (isMatchingProduct) {
        productToCancel = product;
      }
      return isMatchingProduct;
    })
  );
  if (!order || !productToCancel) {
    return res
      .status(404)
      .json({ message: "No product found to cancel for this workshop" });
  }
  productToCancel.deliveryStatus = "Cancelled";
  await checkoutModel.updateOne(
    {
      _id: order._id,
      "products._id": productId,
      "products.color": color,
    },
    { $set: { "products.$.deliveryStatus": productToCancel.deliveryStatus } }
  );
  res.json({
    message: "Product cancelled successfully",
    productToCancel,
  });

});

export { getOrders, pendingOrders, shippedOrders, updateOrders, cancelProduct };

import Stripe from "stripe";
import catchAsync from "../../handleErrors/catchAsync.js";
import checkoutModel from "../../models/checkout.model.js";
import emailNotificatoin from "../../middlewares/refundNotification.js";
import { User } from "../../models/userModel.js";
import { Product } from "../../models/productModel.js";

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

// const getDashboard = catchAsync(async function (req, res) {
//   const { _id } = req.user;
//   if (!_id) {
//     return res.status(400).json({ message: "Workshop ID is required" });
//   }
//   const validOrders = await getValidOrders(_id);
//   if (validOrders.length === 0) {
//     return res
//       .status(404)
//       .json({ message: "No orders found for this workshop" });
//   }

//   const allProducts = validOrders.reduce((acc, order) => {
//     return acc.concat(order.products);
//   }, []);

//   // جمع جميع المنتجات التي تم تسليمها
//   const deliveredProducts = allProducts.filter(
//     (product) => product.deliveryStatus === "Delivered"
//   );

//   // جمع عدد مرات بيع كل منتج
//   const soldProductsCount = allProducts.reduce((acc, product) => {
//     if (!acc[product.id]) {
//       acc[product.id] = {
//         name: product.name,
//         count: 0, // Initialize the count for each product
//       };
//     }
//     acc[product.id].count += 1; // Increment the count for this product
//     return acc;
//   }, {});

//   // Convert the soldProductsCount object to an array
//   const soldProductsArray = Object.values(soldProductsCount);

//   // Extract unique customers with their details and total delivered price
//   const uniqueCustomers = validOrders.reduce((acc, order) => {
//     const customer = order.userId; // Assume userId contains customer info
//     const shippingAddress = order.shippingAddress || {}; // Assume shippingAddress is present in the order
//     const customerId = customer.id;

//     // Find or create the customer entry
//     let customerEntry = acc.find(
//       (existingCustomer) => existingCustomer.id === customerId
//     );
//     if (!customerEntry) {
//       customerEntry = {
//         id: customerId,
//         fullName: customer.fullName,
//         phone: customer.phone,
//         address: customer.address,
//         shippingAddress: shippingAddress, // Add shipping address
//         totalDeliveredPrice: 0, // Initialize total delivered price
//       };
//       acc.push(customerEntry);
//     }

//     // Calculate total delivered price for the current order
//     const deliveredPrice = order.products
//       .filter((product) => product.deliveryStatus === "Delivered")
//       .reduce((sum, product) => sum + (product.price || 0), 0);

//     customerEntry.totalDeliveredPrice += deliveredPrice; // Add delivered price to the customer

//     return acc;
//   }, []);

//   console.log(uniqueCustomers.length);

//   res.json({
//     allProducts: allProducts,
//     deliveredProducts: deliveredProducts, // Include all delivered products in the response
//     customers: uniqueCustomers,
//     soldProducts: soldProductsArray, // Include sold products with their count in the response
//   });
// });

const getDashboard = catchAsync(async function (req, res) {
  const { _id } = req.user;
  if (!_id) {
    return res.status(400).json({ message: "Workshop ID is required" });
  }
  const validOrders = await getValidOrders(_id);

  // حساب المنتجات التي تم بيعها
  const allProducts = validOrders.reduce((acc, order) => {
    return acc.concat(order.products);
  }, []);

  const deliveredProducts = allProducts.filter(
    (product) => product.deliveryStatus === "Delivered"
  );

  // حساب عدد المنتجات التي تم بيعها
  const soldProductsCount = deliveredProducts.reduce((acc, product) => {
    if (!acc[product.productId.id]) {
      acc[product.productId.id] = {
        name: product.productId.name,
        color: product.color,
        count: 0,
      };
    }
    acc[product.productId.id].count += product.quantity;
    return acc;
  }, {});

  // حساب مجموع الأسعار للمنتجات التي تم تسليمها
  const totalSoldValue = deliveredProducts.reduce(
    (sum, product) => sum + (product.price || 0) * product.quantity, // السعر * الكمية
    0
  );

  const totalSoldCount = deliveredProducts.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  const soldProductsArray = Object.values(soldProductsCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((product) => ({
      ...product,
      percentage: ((product.count / totalSoldCount) * 100).toFixed(2) + "%",
    }));

  // Extract unique customers with their details and total delivered price
  const uniqueCustomers = validOrders.reduce((acc, order) => {
    const customer = order.userId;

    if (!customer || !customer.id) {
      return acc;
    }

    const shippingAddress = order.shippingAddress || {};
    const customerId = customer.id;

    let customerEntry = acc.find(
      (existingCustomer) => existingCustomer.id === customerId
    );

    if (!customerEntry) {
      customerEntry = {
        id: customerId,
        fullName: customer.fullName,
        phone: customer.phone,
        address: customer.address,
        shippingAddress: shippingAddress,
        totalDeliveredPrice: 0,
      };
      acc.push(customerEntry);
    }

    const deliveredPrice = order.products
      .filter((product) => product.deliveryStatus === "Delivered")
      .reduce((sum, product) => sum + (product.price * product.quantity || 0), 0);

    customerEntry.totalDeliveredPrice += deliveredPrice;

    return acc;
  }, []);

  res.json({
    allProducts: allProducts,
    deliveredProducts: deliveredProducts,
    topSoldProducts: soldProductsArray,
    customers: uniqueCustomers,
    totalSoldValue: totalSoldValue, // مجموع أسعار المنتجات التي تم تسليمها
  });
});

const getOrders = catchAsync(async function (req, res) {
  const { _id } = req.user;
  if (!_id) {
    return res.status(400).json({ message: "Workshop ID is required" });
  }
  const validOrders = await getValidOrders(_id);
  if (validOrders.length === 0) {
    return res.json([]);
  }
  res.json(validOrders);
});

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
    return res.status(200).json({
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
  const paymentIntentId = order.paymentIntentId;
  if (!order || !productToCancel) {
    return res
      .status(404)
      .json({ message: "No product found to cancel for this workshop" });
  }
  productToCancel.deliveryStatus = "Cancelled";
  console.log("productToCancel", productToCancel);
  const userId = productToCancel.productId.workshop_id.toString();
  console.log("userId", userId);
  const targetUser = await User.findOne({
    _id: userId,
  });
  console.log("targetUser", targetUser);

  await checkoutModel.updateOne(
    {
      _id: order._id,
      "products._id": productId,
      "products.color": color,
    },
    { $set: { "products.$.deliveryStatus": productToCancel.deliveryStatus } }
  );

  const product = await Product.findById(productToCancel.productId._id);
  product.quantity += productToCancel.quantity;
  await product.save();
  res.json({
    message: "Product cancelled successfully",
    productToCancel,
  });
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: productToCancel.price * 100, // Amount in cents (e.g., 500 = $5.00)
    });
    emailNotificatoin(
      targetUser.email,
      targetUser.fullName,
      productToCancel.price
    );
    return refund;
  } catch (error) {
    console.error("Error creating refund:", error);
    throw error;
  }
});

export {
  getOrders,
  pendingOrders,
  shippedOrders,
  updateOrders,
  cancelProduct,
  getDashboard,
};

import catchAsync from "../../handleErrors/catchAsync.js";
import checkoutModel from "../../models/checkout.model.js";

const getOrders = catchAsync(async function (req, res) {
  const userId = req.user.id;

  const ordersItems = await checkoutModel.find({ userId });
  res.json(ordersItems);
});

// const addToOrders = catchAsync(async function (req, res) {
//   const { products, subtotal, total } = req.body;
//   const userId = req.user.id;

//   if (!products || !subtotal || !total) {
//     return res.json({ message: "Enter data" });
//   }
//   // const product = await Product.findById(productId);
//   // if (!product) {
//   //   return res.status(404).json({ message: "Product not found" });
//   // }
//   console.log(products,subtotal,total);
//   console.log(true);
  
  
//   const ordersItem = await checkoutModel.findOne({ userId, products });
//   if (!ordersItem) {
//     const newOrdersItem = new checkoutModel({ userId, products, subtotal, total });
//     await newOrdersItem.save();

//     return res.json({ id: newOrdersItem._id });
//   }

//   res.json({ message: "Item already in cart" });
// });

const addToOrders = catchAsync(async function (req, res) {
  const { products, subTotal, total } = req.body; // تأكد من أن products عبارة عن مصفوفة
  const userId = req.user.id;

  if (!products || !subTotal || !total || !Array.isArray(products)) {
    return res.json({ message: "Enter valid data" });
  }

  console.log(products, subTotal, total);

  // افحص إذا كانت المنتجات موجودة مسبقاً
  const ordersItem = await checkoutModel.findOne({ userId });
  console.log(ordersItem);
  
  if (!ordersItem) {
    console.log("yes");
    
    // إنشاء طلب جديد
    const newOrdersItem = new checkoutModel({ userId, products, subTotal, total });
    await newOrdersItem.save();

    return res.json({ id: newOrdersItem._id });
  }

  res.json({ message: "Item already in orders" });
});

export{
  getOrders,
  addToOrders,
};

import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import ProductOrder from "../models/product_order.model.js";

export const getStats = async (req, res) => {
  const stats = {
    users: await User.countDocuments({}),
    online_users: await User.countDocuments({ logged_in: true }),
    orders: await ProductOrder.countDocuments({}),
    completed_orders: await ProductOrder.countDocuments({
      order_status: "completed",
    }),
    cancelled_orders: await ProductOrder.countDocuments({
      order_status: "cancelled",
    }),
    products: await Product.countDocuments({}),
    phone_products: await Product.countDocuments({ category: "phones" }),
    shoe_products: await Product.countDocuments({ category: "shoes" }),
  };
  res.status(200).json({ stats: stats });
};

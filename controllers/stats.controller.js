import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import ProductOrder from "../models/product_order.model.js";

export const getStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      message: "failed to get stats",
      error: error,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await ProductOrder.find({});
    res.status(200).json({ orders: orders });
  } catch (error) {
    res.status(500).json({
      message: "failed to get orders",
      error: error,
    });
  }
};

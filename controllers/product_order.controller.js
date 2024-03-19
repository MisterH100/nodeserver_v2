import order_id from "order-id";
import sgMail from "@sendgrid/mail";
import ProductOrder from "../models/product_order.model.js";

export const newOrder = async (req, res) => {
  const orderNumber = order_id.generate();
  try {
    const newProductOrder = new ProductOrder({
      order_number: orderNumber,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      products: req.body.products,
      payment_method: req.body.payment_method,
      terms: req.body.terms,
    });
    const order = await newProductOrder.save();
    const { order_number, payment_method, address, orderDate, ...other } =
      order._doc;
    res.send({
      order_number: order_number,
      payment_method: payment_method,
      address: address,
      order_date: orderDate,
    });

    //send message to client
    sgMail.setApiKey(process.env.EMAIL_API_KEY);
    const msg = {
      to: req.body.email,
      from: process.env.FROM_EMAIL,
      subject: "Order Confirmation",
      text:
        "ProductStore Hi " +
        req.body.first_name +
        " Your order: " +
        orderNumber +
        " has been received and processed, our agent will be in touch with you shortly",
      html: `<h1>Order received</h1><br/>
                  <h3>ProductStore Official</h3>
                  <p>Order Number: ${orderNumber}</p>
                  <p>Your order has been received and processed, our agent will be in touch with you shortly</p>
                  `,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent client");
      })
      .catch((error) => {
        console.error(error);
        console.log("Email not sent");
      });

    //notify admin
    const notification = {
      to: process.env.TO_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: "New order",
      text:
        "ProductStore A new order has been placed with order number: " +
        orderNumber,
      html: `<h1>New order</h1> <br/> 
              <h3>ProductStore Official</h3>
              <p> A new order has been placed with order number: ${orderNumber}</p> <br/>`,
    };
    sgMail
      .send(notification)
      .then(() => {
        console.log("Email sent to admin");
      })
      .catch((error) => {
        console.error(error);
        console.log("Email not sent");
      });
  } catch (err) {
    res.send(err);
  }
};

export const orderProducts = async (req, res) => {
  const orderNumber = req.params.order_number;
  try {
    ProductOrder.findOne({ order_number: orderNumber })
      .populate("products")
      .then((order) => {
        const { products, ...other } = order._doc;
        res.send({ products: products });
      });
  } catch (error) {
    res.send(error);
  }
};

export const getOrders = async (req, res) => {
  try {
    ProductOrder.find()
      .populate("products")
      .sort({ createdAt: "descending" })
      .then((orders) => {
        res.send(orders);
      });
  } catch (error) {
    res.send(error);
  }
};

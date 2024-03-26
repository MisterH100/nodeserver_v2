import order_id from "order-id";
import sgMail from "@sendgrid/mail";
import ProductOrder from "../models/product_order.model.js";

export const newOrder = async (req, res) => {
  const orderNumber = order_id(process.env.JWT_SECRET).generate();
  try {
    const newProductOrder = new ProductOrder({
      order_number: orderNumber,
      customer_id: req.body.customer_id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      products: req.body.products,
      price: req.body.price,
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
        "Hi " +
        req.body.first_name +
        " Your order with order number: " +
        orderNumber +
        " has been received",
      html: `<h1>Order received</h1><br/>
                  <h3>external wear sa</h3>
                  <p>Order Number: ${orderNumber}</p>
                  <p>Your order has been received, Your product will be delivered to you within 3 working days,for more information on our delivery terms and conditions, click this <a href="https://productshop-official.vercel.app/learn-more/deliveries" >link</a> </p>
                  <h3>What is to be expected in your package</h3>
                  <div>
                    ${req.body.products.map(
                      (
                        product
                      ) => `<img src=${product.images[0]} alt=${product.name} width="80" height="100" /> <p>${product.name}</p><br/>
                      `
                    )}
                  </div>
                  <p>Payment method: ${req.body.payment_method}</p>
                  <p>Total: R ${req.body.price}</p>
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
      subject: "External wear sa new order",
      text: "A new order has been placed with order number: " + orderNumber,
      html: `<h1>New order</h1>
              <p> A new order has been placed</p>
              <p>Order number: ${orderNumber}</p>
              <p>Full name: ${req.body.first_name} " " ${req.body.last_name} </p>
              <p>Email: ${req.body.email}</p>
              <p>Phone: ${req.body.phone}</p>
              <p>Address: ${req.body.address}</p>
              
              `,
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

export const getOrderByNumber = async (req, res) => {
  const orderNumber = req.params.order_number;
  try {
    ProductOrder.findOne({ order_number: orderNumber }).then((order) => {
      const { products, ...other } = order._doc;
      res.send({ products: products });
    });
  } catch (error) {
    res.send(error);
  }
};

export const getAllOrders = async (req, res) => {
  try {
    ProductOrder.find()
      .sort({ createdAt: "descending" })
      .then((orders) => {
        res.send(orders);
      });
  } catch (error) {
    res.send(error);
  }
};

export const getOrdersByEmail = async (req, res) => {
  const email = req.params.email;
  try {
    ProductOrder.find({ email: email })
      .sort({ createdAt: "descending" })
      .then((orders) => {
        res.send(orders);
      });
  } catch (error) {
    res.send(error);
  }
};

export const getOrdersByCustomerId = async (req, res) => {
  const id = req.params.id;
  try {
    ProductOrder.find({ customer_id: id })
      .sort({ createdAt: "descending" })
      .then((orders) => {
        res.send(orders);
      });
  } catch (error) {
    res.send(error);
  }
};

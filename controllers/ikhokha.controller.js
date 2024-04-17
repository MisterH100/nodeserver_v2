import CryptoJS from "crypto-js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Payment from "../models/payment.model.js";

export const ikhokhaPayment = (req, res) => {
  const apiEndPoint = "https://api.ikhokha.com/public-api/v1/api/payment";
  const ApplicationId = process.env.IKHOKHA_APPID;
  const ApplicationKey = process.env.IKHOKHA_APPSECRET;

  const createDescription = (product) => {
    return ` ${product.name}`;
  };
  const customer_id = req.body.customer_id;
  const TransactionAmount = req.body.price * 100;
  const TransactionDescription = `Buying : ${req.body.products.map((product) =>
    createDescription(product)
  )}`;

  const TransactionExternalEntityID = uuidv4();
  const TransactionPaymentReference = uuidv4();
  const TransactionExternalTransactionID = uuidv4();

  const request = {
    entityID: process.env.IKHOKHA_APPID,
    externalEntityID: TransactionExternalEntityID,
    amount: TransactionAmount,
    currency: "ZAR",
    requesterUrl: "https://externalwear.co.za/checkout",
    description: TransactionDescription,
    paymentReference: TransactionPaymentReference,
    mode: "live",
    externalTransactionID: TransactionExternalTransactionID,
    urls: {
      callbackUrl: "https://externalwear.co.za/checkout",
      successPageUrl: "https://externalwear.co.za/confirm-order",
      failurePageUrl: "https://externalwear.co.za/cart",
      cancelUrl: "https://externalwear.co.za/cart",
    },
  };

  function jsStringEscape(str) {
    try {
      return str.replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0");
    } catch (error) {
      console.log("Error on jsStringEscape" + " " + error);
    }
  }

  function createPayloadToSign(urlPath, body = "") {
    try {
      const parsedUrl = new URL(urlPath);
      const basePath = parsedUrl.pathname;

      if (!basePath) throw new Error("No basePath in url");
      const payload = basePath + body;
      return jsStringEscape(payload);
    } catch (error) {
      console.log("Error on createPayloadToSign" + " " + error);
    }
  }

  async function createPaymentLink() {
    const reqestbody = JSON.stringify(request);

    if (reqestbody.startsWith("'") && reqestbody.endsWith("'")) {
      reqestbody = reqestbody.substring(1, reqestbody.length - 1);
    }

    const payloadToSign = createPayloadToSign(apiEndPoint, reqestbody);
    const signature = CryptoJS.HmacSHA256(
      payloadToSign,
      ApplicationKey.trim()
    ).toString(CryptoJS.enc.Hex);

    try {
      const response = await axios.post(`${apiEndPoint}`, request, {
        headers: {
          Accept: "application/json",
          "IK-APPID": ApplicationId.trim(),
          "IK-SIGN": signature.trim(),
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error on  create Payment link" + " " + error);
    }
  }

  createPaymentLink()
    .then(async (paymentLink) => {
      const newPayment = new Payment({
        payment_id: paymentLink.paylinkID,
        transaction_id: paymentLink.externalTransactionID,
        customer_id: customer_id,
        amount: TransactionAmount,
        payment_description: TransactionDescription,
      });
      await newPayment.save();

      res.status(200).json({ ...paymentLink });
    })
    .catch((error) => {
      res.status(500).json({
        message: "failed to get create payment link",
        error: error,
      });
    });
};

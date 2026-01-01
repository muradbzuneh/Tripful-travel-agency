import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const initializePayment = async (paymentData) => {
  const tx_ref = uuidv4();

  const response = await axios.post(
    "https://api.chapa.co/v1/transaction/initialize",
    {
      amount: paymentData.amount,
      currency: "ETB",
      email: paymentData.email,
      first_name: paymentData.firstName,
      last_name: paymentData.lastName,
      tx_ref: tx_ref,
      callback_url: process.env.CHAPA_CALLBACK_URL,
      return_url: process.env.CHAPA_RETURN_SUCCESS_URL,
      customization: {
        title: "Tripful Travel Agency",
        description: "Travel Package Payment",
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return {
    checkout_url: response.data.data.checkout_url,
    tx_ref,
  };
};

const verifyPayment = async (tx_ref) => {
  const response = await axios.get(
    `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
    }
  );

  if (
    response.data.status === "success" &&
    response.data.data.status === "success"
  ) {
    // ✅ HERE: update DB → payment_status = CONFIRMED
    return "success";
  }

  return "failed";
};

export {
  initializePayment,
  verifyPayment,
};

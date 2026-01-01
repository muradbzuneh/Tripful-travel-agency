import { initializePayment, verifyPayment } from "./payment.service.js";

const initializePaymentController = async (req, res) => {
  try {
    const checkoutData = await initializePayment(req.body);
    res.status(200).json(checkoutData);
  } catch (error) {
    res.status(500).json({
      message: "Payment initialization failed",
      error: error.message,
    });
  }
};

const verifyPaymentController = async (req, res) => {
  try {
    const { tx_ref } = req.query;

    const result = await verifyPayment(tx_ref);

    if (result === "success") {
      // redirect after success
      return res.redirect(process.env.CHAPA_RETURN_SUCCESS_URL);
    } else {
      return res.redirect(process.env.CHAPA_RETURN_FAIL_URL);
    }

  } catch (error) {
    res.status(500).json({
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

export {
  initializePaymentController,
  verifyPaymentController,
};

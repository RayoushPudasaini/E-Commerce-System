import React from "react";
import { useNavigate } from "react-router-dom";
import "./checkoutSuccess.css";

const CheckoutSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="checkout-success">
      <h2>Thank you for your purchase!</h2>
      <p>
        Your order has been successfully processed and will be shipped soon.
      </p>
      <p>
        You can track your order status in the "View Orders" section of your
        account.
      </p>
      <button onClick={() => navigate("/")}>Continue Shopping</button>
    </div>
  );
};

export default CheckoutSuccess;

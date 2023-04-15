import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { url } from "../features/api";
import { clearCart } from "../features/cartSlice";

const PayButton = ({ cartItems }) => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleCheckout = async () => {
    await axios
      .post(`${url}/stripe/create-checkout-session`, {
        cartItems,
        userId: user._id,
      })
      .then((res) => {
        // console.log("res.data", res);
        if (res.data.url) {
          window.location.href = res.data.url;
        }
        // after successful payment, clear cart

        dispatch(clearCart());
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <button onClick={() => handleCheckout()}>Check Out</button>
    </>
  );
};

export default PayButton;

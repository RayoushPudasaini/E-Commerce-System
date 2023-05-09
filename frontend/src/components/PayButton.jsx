import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setHeaders, url } from "../features/api";
import { clearCart } from "../features/cartSlice";
import ToastAlert from "./common/ToastAlert";
import { toast } from "react-toastify";

const PayButton = ({ cartItems }) => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleCheckout = async () => {
    try {
      const res = await axios.post(
        `${url}/stripe/create-checkout-session`,
        {
          cartItems,
          userId: user._id,
        },
        setHeaders()
      );
      if (res.data.url) {
        window.location.href = res.data.url;
        dispatch(clearCart());
      }
    } catch (err) {
      console.log(err.response.data);
      // <ToastAlert type="error" message={err.response.data} />;
      toast.error(err.response.data, {
        theme: "colored",
        autoClose: 1000,
      });
    }
    // .then((res) => {
    //   // console.log("res.data", res);
    //   if (res.data.url) {
    //     window.location.href = res.data.url;
    //   }
    //   // after successful payment, clear cart

    //   dispatch(clearCart());
    // })
    // .catch((err) => {
    //   console.log(err.response.data);
    //   <ToastAlert
    //     type="error"
    //     message={err.response.data || "Something went wrong"}
    //   />;
    // });
  };

  return <button onClick={() => handleCheckout()}>Online Payment</button>;
};

export default PayButton;

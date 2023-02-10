import { Link } from "react-router-dom";
const Cart = () => {
  console.log("Rendering Cart component");
  return (
    <Link to="/cart">
      {" "}
      <h2>Cart</h2>{" "}
    </Link>
  );
};

export default Cart;

import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../features/cartSlice";
import "./customStyles.css";

const AllProducts = ({ data, status }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  return (
    <section>
      <h2>All Products</h2>
      {status === "success" ? (
        <div className="all-products ">
          {data?.map((product) => (
            <div key={product._id} className="product">
              <h3>{product.name}</h3>
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image.url}
                  alt={product.name}
                  className="product_img"
                />
              </Link>

              <div className="details">
                <span>{product.desc}</span>
                <span className="price">${product.price}</span>
              </div>

              <button onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : status === "pending" ? (
        <p>Loading...</p>
      ) : (
        <p>Unexpected error occurred...</p>
      )}
    </section>
  );
};

export default AllProducts;

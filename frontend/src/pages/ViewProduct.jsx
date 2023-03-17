import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "../features/cartSlice";
import { getProductById } from "../features/productsSlice";
import "./viewProduct.css";

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { item, status } = useSelector((state) => state.products);
  //   console.log({ item });
  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  const { name, desc, price, image, brand } = item;

  const handleAddToCart = (product) => {
    dispatch(addToCart(product)); //used to dispatch add to cart action

    navigate("/cart");
  };

  return (
    <section
      className="products__details"
      style={{
        margin: "2rem auto",
      }}
    >
      {status === "success" && (
        <div className="product-description">
          <div className="product-image">
            <img src={image} alt={name} />
          </div>
          <div
            className="product-details"
            onClick={() => handleAddToCart(item)}
          >
            <h2>{name}</h2>
            <p>{desc}</p>
            <p>Brand: {brand}</p>
            <p>Price: ${price}</p>
            <button>Add to Cart</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ViewProduct;
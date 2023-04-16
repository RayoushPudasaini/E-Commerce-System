import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../features/cartSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AllProducts from "./AllProducts";
import "./customStyles.css";

const Home = () => {
  const { items: data, status } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    indicators: true,
    arrows: true,
  };

  return (
    <section className="home-container">
      <h2>New Arrivals</h2>
      {status === "success" ? (
        <Slider {...settings}>
          {data?.slice(0, 4)?.map((product) => (
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
                <p>{product.desc}</p>
                <span className="price">${product.price}</span>
              </div>

              <button onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))}
        </Slider>
      ) : status === "pending" ? (
        <p>Loading...</p>
      ) : (
        <p>Unexpected error occurred...</p>
      )}
      <AllProducts
        data={data}
        status={status}
        className="all-products-container"
      />
    </section>
  );
};

export default Home;

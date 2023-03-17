import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../features/cartSlice";
import Slider from "react-slick";

const Home = () => {
  const { items: data, status } = useSelector((state) => state.products); //uses use selector to get the data from the store

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product)); //used to dispatch add to cart action

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
  };

  return (
    <div className="home-container">
      <h2>New Arrivals</h2>
      {status === "success" ? (
        <Slider {...settings}>
          {data?.map((product) => (
            <div key={product.id} className="product">
              <h3>{product.name}</h3>
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
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
        </Slider>
      ) : status === "pending" ? (
        <p>Loading...</p>
      ) : (
        <p>Unexpected error occured...</p>
      )}
    </div>
  );
};

export default Home;

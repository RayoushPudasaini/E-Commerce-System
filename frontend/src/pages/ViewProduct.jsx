// Import React and necessary hooks/components from other libraries
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "../features/cartSlice";
import { getProductById } from "../features/productsSlice";
import "./viewProduct.css";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import ToastAlert from "../components/common/ToastAlert";

// Define the ViewProduct component
const ViewProduct = () => {
  // Get the product ID from the URL and initialize other hooks
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the product and authentication state from the Redux store
  const { item, status } = useSelector((state) => state?.products);
  const { isAdmin } = useSelector((state) => state?.auth);

  // Destructure the product details
  const { name, desc, price, image, brand, sizes } = item;

  // Initialize the selected size state variable
  const [selectedSize, setSelectedSize] = useState("");

  // Define the function to handle adding the product to the cart
  const handleAddToCart = () => {
    // Check if a size has been selected, and if not, display a toast message
    if (!selectedSize) {
      return ToastAlert({
        type: "error",
        message: "Please select a size",
      });
    }

    // Create a new product object with the selected size and dispatch it to the Redux store
    const product = {
      ...item,
      sizes: selectedSize,
    };
    dispatch(addToCart(product));

    // Navigate to the cart page
    navigate("/cart");
  };

  // Fetch the product details when the component mounts or when the ID changes
  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  // Render the product details and size options if the status is "success"
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
            <Box
              component={"img"}
              src={image?.url}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="product-details">
            <Typography textTransform={"capitalize"} variant="h2">
              {name}
            </Typography>
            <Typography variant="body2" textTransform={"capitalize"}>
              {desc}
            </Typography>
            <p>Brand: {brand}</p>
            <p>Price: ${price}</p>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Size</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={selectedSize}
                row
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {sizes?.map((size) => (
                  <FormControlLabel
                    key={size}
                    value={size}
                    control={<Radio />}
                    label={size}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <br />

            {!isAdmin && <button onClick={handleAddToCart}>Add to Cart</button>}
          </div>
        </div>
      )}
    </section>
  );
};

export default ViewProduct;

import React from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
import { BsFillCartPlusFill as AddShoppingCart } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../features/cartSlice";

const classes = {
  root: {
    maxWidth: 345,
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
  },

  media: {
    height: 200,
    objectFit: "cover",
    "&:hover": {
      transform: "scale(1.085)",
    },
    cursor: "pointer",
    transition: "transform 0.5s ease-in-out",
    backgroundColor: "transparent",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: 4,
    paddingLeft: 2,
    paddingRight: 2,
  },
  price: {
    fontWeight: "bold",
    marginRight: 8,
  },
  button: {
    backgroundColor: "#4b70e2",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#4b70e3",
    },
  },
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { name, desc, price, image } = product;

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    navigate("/cart");
  };
  return (
    <Card sx={classes.root}>
      <CardActionArea>
        <Link to={`/product/${product._id}`}>
          <CardMedia
            sx={classes.media}
            component="img"
            image={image.url}
            alt={name}
          />
        </Link>
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            textTransform={"capitalize"}
          >
            {name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textTransform={"capitalize"}
          >
            {desc}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={classes.actions}>
        <Typography sx={classes.price} variant="h6" color="text.primary">
          ${price}
        </Typography>
        <Button
          size="medium"
          variant="contained"
          color="primary"
          startIcon={<AddShoppingCart />}
          onClick={() => handleAddToCart(product)}
          sx={classes.button}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;

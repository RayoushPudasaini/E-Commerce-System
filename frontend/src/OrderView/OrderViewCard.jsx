import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Divider,
  Box,
  Paper,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";

const StyledCard = styled(Card)({
  maxWidth: 1000,
  margin: "auto",
  padding: 25,
  borderRadius: 4,
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
});

const StyledCardMedia = styled(CardMedia)({
  height: 200,
  objectFit: "contain",
});

const StyledGridItem = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "space-around",
});

const OrderViewCard = ({ orderDetails }) => {
  const navigate = useNavigate();
  return (
    <StyledCard>
      {orderDetails?.map((order) => (
        <CardContent key={order.id}>
          <Grid container spacing={10} alignItems="center">
            <Grid item xs={12} md={5}>
              {order?.product.map((product) => (
                <Paper key={product.id}>
                  <StyledCardMedia
                    component="img"
                    image={product.productImage}
                    alt={product.productName}
                  />
                </Paper>
              ))}
            </Grid>

            <StyledGridItem item xs={12} md={7}>
              {order?.product.map((product) => (
                <Box component={"div"} key={product.id}>
                  <Link
                    to={`/product/${product.id}`}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <Typography
                      variant="h5"
                      gutterBottom
                      fontWeight={"600"}
                      sx={{
                        cursor: "pointer",

                        "&:hover": {
                          color: "#1976d2",
                          textDecoration: "underline",
                          transition: "all 1s in-out",
                        },
                      }}
                    >
                      {product.productName}
                    </Typography>{" "}
                  </Link>
                </Box>
              ))}

              <Box>
                <Typography
                  variant="body1"
                  component={"span"}
                  textTransform={"capitalize"}
                >
                  Order Status:
                </Typography>
                <Box component={"span"} ml={2}>
                  {order.orderStatus === "pending" ? (
                    <Chip label="Pending" color="secondary" />
                  ) : order.orderStatus === "dispatched" ? (
                    <Chip label="Dispatched" color="primary" />
                  ) : order.orderStatus === "delivered" ? (
                    <Chip label="Delivered" color="success" />
                  ) : null}
                </Box>
              </Box>

              <Typography variant="body1" textTransform={"capitalize"} mt={0.5}>
                Order Date: {order.orderDate}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight={"600"}>
                Shipping Details
              </Typography>
              <Typography variant="body1" textTransform={"capitalize"}>
                Payment Status: {order.paymentStatus}
              </Typography>
              <Typography variant="body1" textTransform={"capitalize"}>
                Name: {order.customerName}
              </Typography>
              <Typography variant="body1" textTransform={"capitalize"}>
                Email: {order.customerEmail}
              </Typography>
              <Typography variant="body1" textTransform={"capitalize"}>
                Phone Number: {order.phoneNumber}
              </Typography>
              <Typography variant="body1" textTransform={"capitalize"}>
                Shipping Address: {order.shippingAddress}
              </Typography>
            </StyledGridItem>
          </Grid>
        </CardContent>
      ))}
    </StyledCard>
  );
};

// export default OrderDetailsCard;

export default OrderViewCard;

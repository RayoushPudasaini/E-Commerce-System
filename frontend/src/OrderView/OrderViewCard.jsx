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
import { Link } from "react-router-dom";

const StyledCard = styled(Card)({
  maxWidth: 1000,
  margin: "auto",
  marginBottom: 20,
  padding: 20,
  borderRadius: 4,
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
  cursor: "pointer",
});

const StyledCardMedia = styled(CardMedia)({
  width: "100%",
  height: 150,
  objectFit: "cover",
  borderRadius: 4,
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
});

const StyledGridItem = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "space-around",
});

const OrderViewCard = ({ orderDetails }) => {
  return (
    <StyledCard>
      {orderDetails?.map((order) => (
        <CardContent key={order.id}>
          <Paper
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              boxShadow: 1,
              bgcolor: "background.paper",
              p: 2,
              "&:hover": {
                borderColor: "#4b70e2",
                transition: "all 1s in-out",
                boxShadow: 2,
              },
            }}
          >
            <Grid container spacing={10} alignItems="center">
              <Grid item xs={12} md={5}>
                {order?.product.map((product) => (
                  <Box key={product.id}>
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
                            textTransform: "capitalize",

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
                    <Paper
                      sx={{
                        my: 2,
                      }}
                    >
                      <StyledCardMedia
                        component="img"
                        image={product.productImage}
                        alt={product.productName}
                      />
                    </Paper>
                  </Box>
                ))}
              </Grid>

              <StyledGridItem item xs={12} md={7}>
                <Box>
                  <Typography
                    variant="h6"
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

                <Typography variant="h6" textTransform={"capitalize"} mt={0.5}>
                  Order Date: {order.orderDate}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom fontWeight={"600"}>
                  Shipping Details
                </Typography>
                <Typography variant="h6" textTransform={"capitalize"}>
                  Payment Status: {order.paymentStatus}
                </Typography>
                <Typography variant="h6" textTransform={"capitalize"}>
                  Name: {order.customerName}
                </Typography>
                <Typography variant="h6" textTransform={"capitalize"}>
                  Email: {order.customerEmail}
                </Typography>
                <Typography variant="h6" textTransform={"capitalize"}>
                  Phone Number: {order.phoneNumber}
                </Typography>
                <Typography variant="h6" textTransform={"capitalize"}>
                  Shipping Address: {order.shippingAddress}
                </Typography>
              </StyledGridItem>
            </Grid>
          </Paper>
        </CardContent>
      ))}
    </StyledCard>
  );
};

// export default OrderDetailsCard;

export default OrderViewCard;

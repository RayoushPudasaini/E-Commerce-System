import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import axios from "axios";
import { setHeaders, url } from "../../features/api";
import { Box, Typography } from "@mui/material";

const Order = () => {
  const params = useParams();
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${url}/orders/findOne/${params.id}`,
          setHeaders()
        );

        setOrder(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrder();
  }, [params.id]);

  return (
    <StyledOrders>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <OrdersContainer>
            <h2>Order Details</h2>
            <p>
              Delivery status:{" "}
              {order.delivery_status === "pending" ? (
                <Pending>Pending</Pending>
              ) : order.delivery_status === "dispatched" ? (
                <Dispatched>Dispatched</Dispatched>
              ) : order.delivery_status === "delivered" ? (
                <Delivered>Delivered</Delivered>
              ) : (
                "error"
              )}
            </p>
            <h3>Ordered Product</h3>
            <Items>
              {order?.products?.map(({ productId, quantity }, index) => (
                <Box key={index}>
                  <img
                    src={productId.image.url}
                    alt={productId.name}
                    style={{ width: "100px" }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    {productId.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {productId.brand}
                  </Typography>
                  <Typography>{productId.desc}</Typography>
                  <Typography>{quantity}</Typography>
                  <Typography>
                    {"$" + (productId.price * quantity).toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Items>
            <div>
              <h3>Shipping Details</h3>
              <p> {"$" + (order.total / 100).toLocaleString()}</p>
            </div>
            <div>
              <h3>Payment Details</h3>
              <p> Customer : {order.shipping?.name}</p>
              <p> City : {order.shipping?.address.city}</p>
              <p> Email : {order.shipping?.email}</p>
            </div>
          </OrdersContainer>
        </>
      )}
    </StyledOrders>
  );
};

export default Order;
const StyledOrders = styled.div`
  margin: 3rem;
  display: flex;
  justify-content: center;
  h3 {
    margin: 1.5rem 0 0.5rem 0;
  }
`;

const OrdersContainer = styled.div`
  width: 100%;
  max-width: 500px;
  height: auto;
  margin: 0 auto;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

const Items = styled.div`
  span {
    margin-right: 1.5rem;
    &:first-child {
      font-weight: bold;
    }
  }
`;

const Item = styled.li`
  margin-left: 0.5rem;
  margin-buttom: 0.5rem;
`;

const Pending = styled.span`
  color: rgb(253, 181, 40);
  background: rgb(253, 181, 40, 0.12);
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-size: 14px;
`;

const Dispatched = styled.span`
  color: rgb(0, 153, 255);
  background: rgb(38, 198, 249, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

const Delivered = styled.span`
  color: rgb(38, 198, 249);
  background-color: rgba(102, 108, 255, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

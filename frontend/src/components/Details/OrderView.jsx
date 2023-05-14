import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ordersFetch } from "../../features/orderSlice";
import moment from "moment";
import OrderViewCard from "../../OrderView/OrderViewCard";

const OrderView = () => {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.orders);
  const { id } = useParams();

  const orderList = list?.filter((order) => order._id === id);

  const orderDetails = orderList?.map((order) => {
    return {
      product: order?.products.map((product) => {
        return {
          id: product.productId._id,
          productName: product.productId.name,
          productImage: product.productId.image.url,
        };
      }),
      total: order.total,
      orderDate: moment(order.createdAt).format("DD/MM/YYYY/HH:mm"),
      deliveryDate: moment(order.delivery_date)
        .add(7, "days")
        .format("DD/MM/YYYY"),
      orderStatus: order.delivery_status,
      paymentStatus: order.payment_status,
      shippingAddress: `Nepal, ${order.shipping.address.city}, ${order.shipping.address.postal_code}`,
      customerName: order.shipping.name,
      customerEmail: order.shipping.email,
      phoneNumber: order.shipping.phone,
      id: order._id,
    };
  });

  React.useEffect(() => {
    dispatch(ordersFetch());
  }, [dispatch]);

  return (
    <Box
      sx={{
        mt: 4,
      }}
    >
      <OrderViewCard orderDetails={orderDetails} />;
    </Box>
  );
};

export default OrderView;

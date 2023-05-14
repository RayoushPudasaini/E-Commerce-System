import OrderViewCard from "./OrderViewCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../features/orderSlice";
import { useEffect } from "react";
import moment from "moment";
import { Typography } from "@mui/material";

const UserOrderView = () => {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.orders);

  // check if list contains object or not if not then return empty array
  const checkList = list?.some((item) => typeof item === "object") ? list : [];

  const orderDetails = checkList?.map((order) => {
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
      deliveryDate: moment(order.delivery_date).format("DD/MM/YYYY/HH:mm"),
      orderStatus: order.delivery_status,
      paymentStatus: order.payment_status,
      shippingAddress: `Nepal, ${order.shipping.address.city}, ${order.shipping.address.postal_code}`,
      customerName: order.shipping.name,
      customerEmail: order.shipping.email,
      phoneNumber: order.shipping.phone,
      id: order._id,
    };
  });

  const sortedOrderDetails = orderDetails?.sort((a, b) => {
    return new Date(b.orderDate) - new Date(a.orderDate);
  });

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  return (
    <div className="order-view-container">
      <Typography
        variant="h2"
        my={3}
        textAlign={"center"}
        className="page-title"
        sx={{
          color: "#4b70e2",
        }}
      >
        {sortedOrderDetails.length === 0 ? "No Orders" : "Your Orders"}
      </Typography>
      <OrderViewCard orderDetails={sortedOrderDetails} />
    </div>
  );
};

export default UserOrderView;

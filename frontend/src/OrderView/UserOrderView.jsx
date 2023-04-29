import OrderViewCard from "./OrderViewCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../features/orderSlice";
import { useEffect } from "react";
import moment from "moment";

const UserOrderView = () => {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.orders);

  const orderDetails = list?.map((order) => {
    return {
      product: order.products.map((product) => {
        return {
          id: product.productId._id,
          productName: product.productId.name,
          productImage: product.productId.image.url,
        };
      }),
      total: order.total,
      orderDate: moment(order.createdAt).format("DD/MM/YYYY/HH:mm"),
      orderStatus: order.delivery_status,
      paymentStatus: order.payment_status,
      shippingAddress: `Nepal, ${order.shipping.address.city}, ${order.shipping.address.postal_code}`,
      customerName: order.shipping.name,
      customerEmail: order.shipping.email,
      phoneNumber: order.shipping.phone,
      id: order._id,
    };
  });

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  return <OrderViewCard orderDetails={orderDetails} />;
};

// export default OrderDetailsCard;

export default UserOrderView;

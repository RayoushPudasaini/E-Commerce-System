import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url, setHeaders } from "./api";
import ToastAlert from "../components/common/ToastAlert";
import { toast } from "react-toastify";

const initialState = {
  list: [],
  status: null,
  orderCreateStatus: null,
};

//creating Async thunks for fetching user orders and creating orders and editing orders:

export const ordersFetch = createAsyncThunk("orders/ordersFetch", async () => {
  try {
    const response = await axios.get(`${url}/orders`, setHeaders());
    return response.data;
  } catch (error) {
    console.log(error);
  }
});
export const fetchUserOrders = createAsyncThunk(
  "orders/user-orders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url}/orders/user-orders`,
        setHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const orderCreate = createAsyncThunk(
  "orders/orderCreate",
  async (values, { getState, rejectWithValue }) => {
    const state = getState();
    // const productId = state.cart.cartItems.map((item) => item._id);
    // const quantity = state.cart.cartItems.map((item) => item.cartQuantity);
    const total = state.cart.cartTotalAmount;

    const products = state.cart.cartItems.map((item) => ({
      productId: item._id,
      quantity: item.cartQuantity,
    }));

    const newOrder = {
      products,
      total,
      ...values,
    };

    try {
      const response = await axios.post(
        `${url}/orders/cash-on-delivery`,
        newOrder,
        setHeaders()
      );

      return response.data;
    } catch (error) {
      <ToastAlert type="error" message={error.response.data.message} />;
      return rejectWithValue(error.response.data);
    }
  }
);

export const orderEdit = createAsyncThunk(
  "orders/orderEdit",
  async (values, { getState, rejectWithValue }) => {
    const state = getState();

    let currentOrder = state.orders.list.filter(
      (order) => order._id === values.id
    );

    const newOrder = {
      ...currentOrder[0],
      delivery_status: values.delivery_status,
    };

    try {
      const response = await axios.put(
        `${url}/orders/${values.id}`,
        newOrder,
        setHeaders()
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//It defines the name as 'orders' and including the reducers and extra reducers

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    orderCreateReset: (state) => {
      state.orderCreateStatus = null;
    },
  },
  //For handling asynchronous actions
  extraReducers: {
    [ordersFetch.pending]: (state, action) => {
      state.status = "pending";
    },
    [ordersFetch.fulfilled]: (state, action) => {
      state.list = action.payload;
      state.status = "success";
    },
    [ordersFetch.rejected]: (state, action) => {
      state.status = "rejected";
    },
    [fetchUserOrders.pending]: (state, action) => {
      state.status = "pending";
    },
    [fetchUserOrders.fulfilled]: (state, action) => {
      state.list = action.payload;
      state.status = "success";
      state.orderCreateStatus = null;
    },
    [fetchUserOrders.rejected]: (state, action) => {
      state.status = "rejected";
    },
    [orderEdit.pending]: (state, action) => {
      state.status = "pending";
    },
    [orderEdit.fulfilled]: (state, action) => {
      const updateOrders = state.list.map((order) =>
        order._id === action.payload._id ? action.payload : order
      );
      state.list = updateOrders;
      state.status = "success";
    },
    [orderEdit.rejected]: (state, action) => {
      state.status = "rejected";
    },
    [orderCreate.pending]: (state, action) => {
      state.status = null;
      state.orderCreateStatus = "pending";
      state.list = [];
    },
    [orderCreate.fulfilled]: (state, action) => {
      state.list.push(action.payload);
      state.status = null;
      state.orderCreateStatus = "success";
      toast.success("Order created successfully", {
        theme: "colored",
        autoClose: 2500,
        type: "success",
      });
    },
    [orderCreate.rejected]: (state, action) => {
      state.status = null;
      state.orderCreateStatus = "rejected";
    },
  },
});

export default orderSlice.reducer;

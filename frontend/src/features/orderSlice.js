import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url, setHeaders } from "./api";

const initialState = {
  list: [],
  status: null,
};

export const ordersFetch = createAsyncThunk("orders/ordersFetch", async () => {
  try {
    const response = await axios.get(`${url}/orders`, setHeaders());
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const orderEdit = createAsyncThunk("orders/orderEdit", async (order) => {
  try {
    const response = await axios.put(
      `${url}/orders/${order.id}`,
      order,
      setHeaders()
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
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
    [orderEdit.pending]: (state, action) => {
      state.status = "pending";
    },
    [orderEdit.fulfilled]: (state, action) => {
      state.status = "success";
    },
    [orderEdit.rejected]: (state, action) => {
      state.status = "rejected";
    },
  },
});

export default orderSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../features/api";

const initialState = {
  items: [],
  status: null,
  error: null,
};

export const productsFetch = createAsyncThunk(
  "products/productsFetch",
  async () => {
    const response = await axios.get("http://localhost:5000/products");
    return response?.data;
  }
);

export const productsCreate = createAsyncThunk(
  "products/productsCreate",
  async (values) => {
    const response = await axios.post(`${url}/products`, values);

    return response.data;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(productsFetch.pending, (state, action) => {
        //immer
        state.status = "pending";
      })
      .addCase(productsFetch.fulfilled, (state, action) => {
        //immer
        state.status = "success";
        state.items = action.payload;
      })
      .addCase(productsFetch.rejected, (state, action) => {
        //immer
        state.status = "rejected";
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;

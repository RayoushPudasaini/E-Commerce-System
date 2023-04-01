import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHeaders, url } from "../features/api";

import ToastAlert from "../components/common/ToastAlert";

const initialState = {
  items: [],
  item: {},
  status: null,
  error: null,
  createStatus: null,
};

export const productsFetch = createAsyncThunk(
  "products/productsFetch",
  async (rejectWithValue) => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProductById = createAsyncThunk(
  "products/getProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/products/find/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const productsCreate = createAsyncThunk(
  "products/productsCreate",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/products`, data, setHeaders());
      if (response.status === 200) {
        ToastAlert({
          type: "success",
          message: "Product created successfully",
        });
      }
      return response.data;
      // setSuccess(true);
    } catch (error) {
      ToastAlert({
        type: "error",
        message: error.response.data.message,
      });

      return rejectWithValue(error.response.data);
    }
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
      }) // remove the extra closing curly brace here
      .addCase(getProductById.pending, (state, action) => {
        //immer
        state.status = "pending";
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        //immer
        state.status = "success";
        state.item = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        //immer
        state.status = "rejected";
        state.error = action.payload;
      }) // remove the extra closing curly brace here
      .addCase(productsCreate.pending, (state, action) => {
        //immer
        state.createStatus = "pending";
      })
      .addCase(productsCreate.fulfilled, (state, action) => {
        //immer
        state.createStatus = "success";
        state.items.push(action.payload);
        setTimeout(() => {
          window.location.href = "/admin/create-product";
        }, 3000);
      })
      .addCase(productsCreate.rejected, (state, action) => {
        //immer
        state.createStatus = "rejected";
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;

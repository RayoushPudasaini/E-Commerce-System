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
  editStatus: null,
  deleteStatus: null,
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
export const productsEdit = createAsyncThunk(
  "products/productsEdit",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${url}/products/${data.product.currentProd._id}`,
        data,
        setHeaders()
      );

      if (response.status === 200) {
        ToastAlert({
          type: "success",
          message: "Product updated successfully",
        });
        return response.data;
      }

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

export const productDelete = createAsyncThunk(
  "products/productDelete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${url}/products/${id}`,
        setHeaders()
      );
      if (response.status === 200) {
        ToastAlert({
          type: "success",
          message: response.data.message,
        });
      }
      return response.data;
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
      })
      .addCase(productDelete.pending, (state, action) => {
        //immer
        state.status = "pending";
      })
      .addCase(productDelete.fulfilled, (state, action) => {
        //immer
        state.status = "success";
        state.items = state.items.filter(
          (item) => item._id !== action.payload.product._id
        );
      })
      .addCase(productDelete.rejected, (state, action) => {
        //immer
        state.status = "rejected";
        state.error = action.payload;
      })

      .addCase(productsEdit.pending, (state, action) => {
        //immer
        state.editStatus = "pending";
      })
      .addCase(productsEdit.fulfilled, (state, action) => {
        const updatedProducts = state?.items.map((product) =>
          product._id === action.payload._id ? action.payload : product
        );
        state.items = updatedProducts;

        // console.log(action.payload, "action.payload");
        // console.log(state.items, "state.items");
        //immer
        state.editStatus = "success";
        // state.items = state.items.filter(
        //   (item) => item._id !== action.payload.product._id
        // );
      })
      .addCase(productsEdit.rejected, (state, action) => {
        //immer
        state.editStatus = "rejected";
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;

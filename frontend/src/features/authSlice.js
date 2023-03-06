import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { url, setHeaders } from "./api";
import { toast } from "react-toastify";

const initialState = {
  token: localStorage.getItem("token"),
  name: "",
  email: "",
  _id: "",
  isAdmin: false,
  registerStatus: "",
  registerError: "",
  loginStatus: "",
  loginError: "",
  userLoaded: false,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (values, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${url}/register`, {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (res.status === 200) {
        toast.success(`Welcome ${res.data.user.name}`, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
      const jsonData = JSON.stringify(res.data);
      localStorage.setItem("token", jsonData);
      return res.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (values, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${url}/login`, {
        email: values.email,
        password: values.password,
      });
      if (res.status === 200) {
        toast.success(`Welcome ${res.data.user.name}`, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
      const jsonData = JSON.stringify(res.data);
      localStorage.setItem("token", jsonData);
      return res.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (id, { rejectWithValue }) => {
    try {
      const token = await axios.get(`${url}/user/${id}`, setHeaders());

      localStorage.setItem("token", token.data);

      return token.data;
    } catch (error) {
      console.log(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadUser(state, action) {
      const data = JSON.parse(state.token);

      if (data) {
        const user = jwtDecode(data.token);
        return {
          ...state,
          token: data.token,
          name: user.name,
          email: user.email,
          _id: user._id,
          isAdmin: user.isAdmin,
          userLoaded: true,
        };
      } else return { ...state, userLoaded: true };
    },
    logoutUser(state, action) {
      localStorage.removeItem("token");

      return {
        ...state,
        token: "",
        name: "",
        email: "",
        _id: "",
        isAdmin: false,
        registerStatus: "",
        registerError: "",
        loginStatus: "",
        loginError: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state, action) => {
      return { ...state, registerStatus: "pending" };
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      if (action.payload) {
        const userData = jwtDecode(action.payload.token);
        const { user, message, token } = action.payload;
        if (userData._id === user._id)
          return {
            ...state,
            token,
            name: user.name,
            email: user.email,
            _id: user._id,
            isAdmin: user.isAdmin,
            loginStatus: message,
          };
      }
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      return {
        ...state,
        registerStatus: "rejected",
        registerError: action.payload,
      };
    });
    builder.addCase(loginUser.pending, (state, action) => {
      return { ...state, loginStatus: "pending" };
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      if (action.payload) {
        const userData = jwtDecode(action.payload.token);
        const { user, message, token } = action.payload;
        if (userData._id === user._id)
          return {
            ...state,
            token,
            name: user.name,
            email: user.email,
            _id: user._id,
            isAdmin: user.isAdmin,
            loginStatus: message,
          };
      }
      return state;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      return {
        ...state,
        loginStatus: "rejected",
        loginError: action.payload,
      };
    });
    builder.addCase(getUser.pending, (state, action) => {
      return {
        ...state,
        getUserStatus: "pending",
      };
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      if (action.payload) {
        const user = jwtDecode(action.payload);
        return {
          ...state,
          token: action.payload,
          name: user.name,
          email: user.email,
          _id: user._id,
          isAdmin: user.isAdmin,
          getUserStatus: "success",
        };
      } else return state;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      return {
        ...state,
        getUserStatus: "rejected",
        getUserError: action.payload,
      };
    });
  },
});

export const { loadUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;

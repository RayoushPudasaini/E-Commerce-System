import React, { useEffect, useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/authSlice";
import { Box } from "@mui/material";

import { FaEye, FaEyeSlash } from "react-icons/fa";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, isAdmin } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }
  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      return toast.warning(`Invalid Email or Password`, {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    }

    const data = {
      email,
      password,
    };
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (token && !isAdmin && cart.cartItems.length === 0) {
      navigate("/", { replace: true });
    } else if (token && !isAdmin && cart.cartItems.length > 0) {
      navigate("/cart", { replace: true });
    } else if (token && isAdmin) {
      navigate("/admin/summary", { replace: true });
    }
  }, [navigate, token, cart, isAdmin]);

  return (
    <div className="login__div">
      <form onSubmit={handleSubmit} className="login__form">
        <h1>Login</h1>
        <div className="gap-top">
          <p> New User? </p>
          <Link to="/Register" className="forgot-password">
            <h4> Register here </h4>
          </Link>
        </div>
        <input type="email" onChange={handleEmailChange} placeholder="E-mail" />
        <Box
          sx={{
            position: "relative",
            top: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            width: "100%",
          }}
        >
          <input
            type={showPassword ? "text" : "password"}
            onChange={handlePasswordChange}
            placeholder="Password"
          />
          {
            <Box
              component="span"
              sx={{
                position: "absolute",
                top: "40%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Box>
          }
        </Box>
        <button type="submit" id="button-login">
          Login
        </button>
        <Link
          to="/forgot-password"
          style={{
            marginTop: "10px",
            alignSelf: "flex-end",
          }}
          className="forgot-password"
        >
          <p> Forgot Password</p>
        </Link>
      </form>
      <div style={{ marginTop: "20px", fontSize: "0.8rem" }}>
        <p>
          &#169; {new Date().getFullYear()} Juttapasal. All rights reserved.{" "}
          <span style={{ verticalAlign: "middle" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-people-fill"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M6.003 10.8c.32-.433.726-.8 1.212-1.088C5.628 9.253 3 8.467 3 6a3 3 0 1 1 6 0c0 2.467-2.628 3.253-4.215 3.712.486.288.892.655 1.212 1.088zM1 12s1-2 3-2 3 2 3 2-1 1-3 1-3-1-3-1zm11 0s-1-2-3-2-3 2-3 2 1 1 3 1 3-1 3-1zm-6-6a2 2 0 1 0 .001-3.999A2 2 0 0 0 6 6zm6 0a2 2 0 1 0 .001-3.999A2 2 0 0 0 12 6z"
              />
            </svg>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

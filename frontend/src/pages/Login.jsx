import React, { useEffect, useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/authSlice";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const cart = useSelector((state) => state.cart);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }
  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      return toast.warning(`All fields are required.`, {
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
    if (token && cart.cartItems.length === 0) {
      navigate("/", { replace: true });
    } else if (token && cart.cartItems.length > 0) {
      navigate("/cart", { replace: true });
    }
  }, [navigate, token, cart]);

  return (
    <div className="login__div">
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input type="email" onChange={handleEmailChange} placeholder="E-mail" />
        <input
          type="password"
          onChange={handlePasswordChange}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

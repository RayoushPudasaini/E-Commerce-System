import React, { useState, useEffect } from "react";
import "./register.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../features/authSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, isAdmin } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { name, email, password, confirmPassword } = formData;
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      return toast.warning(`All fields are required.`, {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
    if (password !== confirmPassword) {
      return toast.warning(`Passwords do not match. Please try again.`, {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    }

    const data = {
      name,
      email,
      password,
    };
    dispatch(registerUser(data));
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
    <div className="register__div">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={handleChange}
          placeholder="Full Name"
          value={name}
          name="name"
        />
        <input
          type="email"
          onChange={handleChange}
          placeholder="E-mail"
          value={email}
          name="email"
        />

        <input
          type="password"
          onChange={handleChange}
          placeholder="Password"
          value={password}
          name="password"
        />
        <input
          type="password"
          onChange={handleChange}
          placeholder="Confirm password"
          value={confirmPassword}
          name="confirmPassword"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

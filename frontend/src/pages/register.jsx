import React, { useState, useEffect } from "react";
import "./register.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../features/authSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const cart = useSelector((state) => state.cart);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  function handleNameChange(event) {
    setName(event.target.value);
  }
  function handleEmailChange(event) {
    setEmail(event.target.value);
  }
  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
  }

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
    if (token && cart.cartItems.length === 0) {
      navigate("/", { replace: true });
    } else if (token && cart.cartItems.length > 0) {
      navigate("/cart", { replace: true });
    }
  }, [navigate, token, cart]);

  return (
    <div className="register__div">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={handleNameChange}
          placeholder="Full Name"
          value={name}
        />
        <input
          type="email"
          onChange={handleEmailChange}
          placeholder="E-mail"
          value={email}
        />

        <input
          type="password"
          onChange={handlePasswordChange}
          placeholder="Password"
          value={password}
        />
        <input
          type="password"
          onChange={handleConfirmPasswordChange}
          placeholder="Confirm password"
          value={confirmPassword}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

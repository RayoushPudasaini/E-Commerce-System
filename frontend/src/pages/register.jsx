import React, { useState, useEffect } from "react";
import "./register.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../features/authSlice";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, isAdmin } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          type="Password"
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
        <Link
          to="/login"
          style={{
            marginTop: "10px",
            alignSelf: "flex-end",
            fontSize: "0.8rem",
            textDecoration: "none",
          }}
          className="Signin"
        >
          <p>
            Already have an account?{" "}
            <span style={{ textDecoration: "underline" }}>Sign in</span>
          </p>
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
              class="bi bi-people-fill"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M6.003 10.8c.32-.433.726-.8 1.212-1.088C5.628 9.253 3 8.467 3 6a3 3 0 1 1 6 0c0 2.467-2.628 3.253-4.215 3.712.486.288.892.655 1.212 1.088zM1 12s1-2 3-2 3 2 3 2-1 1-3 1-3-1-3-1zm11 0s-1-2-3-2-3 2-3 2 1 1 3 1 3-1 3-1zm-6-6a2 2 0 1 0 .001-3.999A2 2 0 0 0 6 6zm6 0a2 2 0 1 0 .001-3.999A2 2 0 0 0 12 6z"
              />
            </svg>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;

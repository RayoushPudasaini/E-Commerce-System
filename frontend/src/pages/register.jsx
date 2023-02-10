import React, { useState } from "react";
import axios from "axios";
import "./register.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
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
    try {
      const res = await axios.post("http://localhost:5000/api/register", data);
      if (res.status === 200) {
        toast.success(`Registered Successfully`, {
          position: "top-right",
          autoClose: 2000,
          theme: "colored",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

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

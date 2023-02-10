import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
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
    try {
      const res = await axios.post("http://localhost:5000/api/login", data);
      console.log({ res });
      if (res.status === 200) {
        toast.success(`Welcome ${res.data.user.name}`, {
          position: "top-right",
          autoClose: 3000,
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
    <div className="login__div">
      <h1>login</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <input type="email" onChange={handleEmailChange} placeholder="email" />
        <input
          type="password"
          onChange={handlePasswordChange}
          placeholder="password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

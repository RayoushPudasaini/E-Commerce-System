import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { url } from "../features/api";

const ResetPassword = () => {
  const [password, setPassword] = React.useState("");
  const [cpassword, setCPassword] = React.useState("");
  const [error, setError] = React.useState({
    status: false,
    msg: "",
    type: "",
  });

  const navigate = useNavigate();

  const { id, token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (password && cpassword) {
        if (password === cpassword) {
          const res = await axios.post(
            `${url}/users/reset-password/${id}/${token}`,
            {
              password,
              password_confirmation: cpassword,
            }
          );
          console.log(res, "res");
          if (res.data.status === "success") {
            setPassword("");
            setCPassword("");
            setError({
              status: true,
              msg: "Password Reset Successfully. Redirecting to Login Page...",
              type: "success",
            });
            setTimeout(() => {
              navigate("/login", {
                replace: true,
              });
            }, 3000);
          }
          if (res.data.status === "failed") {
            setError({ status: true, msg: res.data.message, type: "error" });
          }
        } else {
          setError({
            status: true,
            msg: "Password and Confirm Password Doesn't Match",
            type: "error",
          });
        }
      } else {
        setError({
          status: true,
          msg: "All Fields are Required",
          type: "error",
        });
      }
    } catch (error) {
      setError({
        status: true,
        msg: error.response.data.msg,
        type: "error",
      });
    }
  };

  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form>
        <Paper
          elevation={3}
          sx={{
            padding: "2rem",
            width: "100%",
            maxWidth: "500px",
            margin: "auto",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Forgot Password
          </Typography>
          <Typography variant="body1" gutterBottom>
            Enter your email address and we'll send you a link to reset your
            password.
          </Typography>

          <Box sx={{ mt: 1 }}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="cpassword">Confirm Password</label>
            <input
              type="password"
              id="cpassword"
              value={cpassword}
              onChange={(e) => setCPassword(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              color="success"
              onClick={handleSubmit}
            >
              Send Reset Link
            </Button>
          </Box>
          {error.status ? (
            <Alert sx={{ mt: 2 }} severity={error.type}>
              {error.msg}
            </Alert>
          ) : (
            ""
          )}
        </Paper>
      </form>
    </section>
  );
};

export default ResetPassword;

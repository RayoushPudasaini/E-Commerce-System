import * as React from "react";
import { Paper, Box, Typography, Button, Alert } from "@mui/material";
import ToastAlert from "../components/common/ToastAlert";
import axios from "axios";
import { url } from "../features/api";

const SendPasswordResetEmail = () => {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState({
    status: false,
    msg: "",
    type: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        const res = await axios.post(`${url}/users/send-reset-password-link`, {
          email,
        });
        if (res.data.status === "success") {
          setEmail("");
          setError({
            status: true,
            msg: "Password Reset Email Sent. Check Your Email !!",
            type: "success",
          });
          <ToastAlert
            type={error.type}
            message={error.msg}
            position="top-right"
          />;
        }
        if (res.data.status === "failed") {
          setError({ status: true, msg: res.data.msg, type: "error" });
        }
      } catch (error) {
        setError({
          status: true,
          msg: error.response.data.msg,
          type: "error",
        });
      }
    } else {
      setError({
        status: true,
        msg: "Please Provide Valid Email",
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

export default SendPasswordResetEmail;

export const url = "http://localhost:5000/api";

export const setHeaders = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const headers = {
    headers: {
      "x-auth-token": token.token,
    },
  };

  return headers;
};

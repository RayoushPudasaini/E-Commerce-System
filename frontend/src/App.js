import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Cart from "./components/Cart";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Login from "./pages/Login";
import Register from "./pages/register";

import { ToastContainer } from "react-toastify";
import CheckoutSucess from "./components/CheckoutSucess";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />
        <NavBar /> <h1>Carousel</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout-success" element={<CheckoutSucess />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <h1>Footer</h1>
      </BrowserRouter>
    </div>
  );
}

export default App;

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
import Dashboard from "./components/admin/Dashboard";
import Products from "./components/admin/Products";
import Summary from "./components/admin/Summary";
import CreateProduct from "./components/admin/CreateProduct";
import Carousel from "./components/Carousel";
import { useSelector } from "react-redux";
import Footer from "./components/Footer";
import ViewProduct from "./pages/ViewProduct";

function App() {
  const auth = useSelector((state) => state.auth);

  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />
        <NavBar />
        {!auth.isAdmin && <Carousel />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ViewProduct />} />
          <Route path="/checkout-success" element={<CheckoutSucess />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/:admin" element={<Dashboard />}>
            <Route path="Products" element={<Products />} />
            <Route path="Create-product" element={<CreateProduct />} />

            <Route path="Summary" element={<Summary />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

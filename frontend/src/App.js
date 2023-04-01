import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
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
import Orders from "./components/admin/Orders";

function App() {
  const { isAdmin, token } = useSelector((state) => state.auth);

  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />
        <NavBar />
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
          </Route>

          <Route path="/product/:id" element={<ViewProduct />} />
          {!isAdmin && (
            <>
              <Route path="/checkout-success" element={<CheckoutSucess />} />
              <Route path="/cart" element={<Cart />} />
            </>
          )}

          <Route path="/Register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {isAdmin && token && (
            <Route path="/:admin" element={<Dashboard />}>
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="create-product" element={<CreateProduct />} />
              <Route path="Summary" element={<Summary />} />
            </Route>
          )}

          <Route path="*" element={<NotFound />} />
        </Routes>
        {!isAdmin && <Footer />}
      </BrowserRouter>
    </div>
  );
}

export default App;

const RootLayout = () => {
  return (
    <>
      <Carousel />
      <Outlet />
    </>
  );
};

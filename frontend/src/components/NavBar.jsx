import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { logoutUser } from "../features/authSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const { cartTotalQuantity } = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // console.log(auth, "auth");

  return (
    <nav className="nav-bar">
      <Link to="/">
        <h2>JuttaPasal</h2>
      </Link>

      {!auth.isAdmin && (
        <Link to="/cart">
          <div className="nav-bar-cart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              fill="currentColor"
              className="bi bi-cart4"
              viewBox="0 0 16 16"
            >
              <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
            </svg>
            <span className="cart-quantity">
              <span>{cartTotalQuantity}</span>
            </span>
          </div>
        </Link>
      )}

      {auth._id && auth.token ? (
        <div
          className="auth-links "
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: `${auth.isAdmin ? "8.5rem" : "4rem"}`,
          }}
        >
          <button
            onClick={() => {
              dispatch(logoutUser(null));

              toast.warning("Logged out!", {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
              });
              navigate("/", { replace: true });
            }}
            style={{
              background: "rgb(77, 140, 174)",
              padding: "0.4rem 0.7rem",
              border: "none",
              borderRadius: "0.2rem",
              cursor: "pointer",
              outline: "none",
              color: "#fff",
            }}
          >
            Logout
          </button>
          {auth.isAdmin && (
            <Link
              style={{
                background: "rgb(77, 140, 174)",
                padding: "0.4rem 0.7rem",
                border: "none",
                borderRadius: "0.2rem",
                cursor: "pointer",
                outline: "none",
                color: "#fff",
                fontSize: "0.8rem",
                boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                fontWeight: "600",
              }}
              to="/admin/Summary"
            >
              Admin
            </Link>
          )}
        </div>
      ) : (
        <div
          className="auth-links "
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "8rem",
          }}
        >
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

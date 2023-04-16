import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  MenuItem,
  Divider,
  Box,
  IconButton,
  Avatar,
  ListItemIcon,
} from "@mui/material";
import { FiLogOut as Logout } from "react-icons/fi";
import { toast } from "react-toastify";
import { logoutUser } from "../features/authSlice";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";

const NavBar = () => {
  const dispatch = useDispatch();
  const { cartTotalQuantity } = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);

  const { pathname } = useLocation();

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser(null));

    toast.warning("Logged out!", {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });
    navigate("/", { replace: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search === "") return;
    navigate(`/search/${search}`, {
      state: { search: search },
      replace: true,
    });
  };

  useEffect(() => {
    if (pathname !== "/search") {
      setSearch("");
    }
  }, [pathname]);

  return (
    <>
      <nav className="nav-bar">
        <Link to="/">
          <h2>JuttaPasal</h2>
        </Link>

        <form
          style={{
            // set all styles to initial value
            all: "initial",
          }}
          onSubmit={handleSearch}
        >
          <div className="search__div">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="contained">Search</Button>
          </div>
        </form>
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
            )}{" "}
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  {/* <Avatar
                    sx={{ width: 32, height: 32, textTransform: "uppercase" }}
                  > 
                   {auth.name[0]}
            
                   </Avatar> */}
                  <img
                    src={
                      "https://img.freepik.com/free-icon/user_318-159711.jpg"
                    }
                    alt="avatar"
                    style={{
                      width: 32,
                      height: 32,
                    }}
                  />
                </IconButton>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {/* <MenuItem onClick={handleClose}>
                  <Avatar /> Profile
                </MenuItem> */}

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="medium" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
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
    </>
  );
};

export default NavBar;

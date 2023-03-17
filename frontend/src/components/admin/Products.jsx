import { Outlet, useNavigate } from "react-router-dom";
import { AdminHeaders, PrimaryButton } from "./CommonStyled";

const Products = () => {
  const navigate = useNavigate();

  return (
    <>
      <AdminHeaders>
        Products
        <PrimaryButton onClick={() => navigate("/admin/Create-product")}>
          Create
        </PrimaryButton>
      </AdminHeaders>

      <Outlet />
    </>
  );
};

export default Products;

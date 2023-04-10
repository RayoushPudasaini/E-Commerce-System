import { Outlet, useNavigate } from "react-router-dom";
import { AdminHeaders, PrimaryButton } from "./CommonStyled";
import ProductsList from "./list/ProductsList";

const Products = () => {
  const navigate = useNavigate();

  return (
    <>
      <AdminHeaders>
        Products
        <PrimaryButton onClick={() => navigate("/admin/create-product")}>
          Create
        </PrimaryButton>
      </AdminHeaders>
      <ProductsList />
      <Outlet />
    </>
  );
};

export default Products;

import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import AllProducts from "./components/AllProducts";

const SearchProduct = () => {
  const { name } = useParams();
  const [loading, setLoading] = React.useState("pending");
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    // http://localhost:5000/api/products?page=1&name[regex]=Nike&sort=oldest&limit=100
    const fetchProducts = async () => {
      setLoading("pending");
      const res = await axios.get(
        `http://localhost:5000/api/products?name[regex]=${name}`
      );
      if (res.status === 200) {
        setProducts(res.data);
      }
      setLoading("success");
    };
    fetchProducts();
  }, [name]);

  return (
    <section
      style={{
        margin: "0 5rem 0 8rem",
      }}
    >
      <AllProducts data={products} status={loading} />
    </section>
  );
};

export default SearchProduct;

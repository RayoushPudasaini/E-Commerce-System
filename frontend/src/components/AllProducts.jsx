import React from "react";
import "./customStyles.css";
import { Grid, Typography } from "@mui/material";
import ProductCard from "./ProductCard";

const AllProducts = ({ data, status }) => {
  return (
    <section
      style={{
        margin: "2rem auto",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          margin: "2.5rem 0 1.5rem 0",
        }}
      >
        {data?.length > 0 ? "All Products" : "No Products Found!"}
      </Typography>
      {status === "success" ? (
        <Grid container spacing={3}>
          {data?.map((product) => (
            <Grid item xs={12} sm={6} md={5} lg={4} key={product._id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      ) : status === "pending" ? (
        <p>Loading...</p>
      ) : (
        <p>Unexpected error occurred...</p>
      )}
    </section>
  );
};

export default AllProducts;

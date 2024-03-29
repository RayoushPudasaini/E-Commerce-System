import { useState } from "react";
import { useDispatch } from "react-redux";
import { productsCreate } from "../../features/productsSlice";
import Resizer from "react-image-file-resizer";
import { PrimaryButton } from "./CommonStyled";
import styled from "styled-components";
import ToastAlert from "../common/ToastAlert";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";

export const sizes = ["S", "M", "L", "XL", "XXL"];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CreateProduct = () => {
  const dispatch = useDispatch();

  const [productImg, setProductImg] = useState(null);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");

  const [productSize, setProductSize] = useState(sizes);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setProductSize(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleProductImageUpload = (e) => {
    try {
      const file = e.target.files[0];
      if (file.size > 1000000) {
        e.target.value = null;
        ToastAlert({
          type: "error",
          message: "Please upload an image smaller than 1MB. !",
          position: "top-center",
        });
        return;
      }
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          setProductImg(uri);
        },
        "base64",
        200,
        200
      );
    } catch (err) {
      ToastAlert({
        type: "error",
        message: err.message,
        position: "top-center",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const priceN = parseInt(price);
    const data = {
      name,
      brand,
      price: priceN,
      desc,
      sizes: productSize,
      image: productImg,
    };
    dispatch(productsCreate({ data }));
  };
  return (
    <StyledCreateProduct>
      <StyledForm onSubmit={handleSubmit}>
        <h3>Create a Product </h3>
        <input
          type="file"
          accept="image/"
          onChange={handleProductImageUpload}
        />
        <select onChange={(e) => setBrand(e.target.value)} required>
          <option values="">Select Brand </option>
          <option values="Nike">Nike </option>
          <option values="GoldStar">GoldStar</option>
          <option values="Addidas">Addidas </option>
          <option values="others">Others</option>
        </select>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="demo-multiple-chip-label" sx={{}}>
            Available Sizes
          </InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={productSize}
            onChange={handleChange}
            input={
              <OutlinedInput
                id="select-multiple-chip"
                label="Available Sizes"
              />
            }
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {sizes.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <input
          type="number"
          placeholder="Price"
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Short Description"
          onChange={(e) => setDesc(e.target.value)}
        />

        <PrimaryButton type="submit">Submit</PrimaryButton>
      </StyledForm>
      <ImagePreview>
        {productImg ? (
          <>
            <img src={productImg} alt="product img " />
          </>
        ) : (
          <p>Image preview will appear here !</p>
        )}
      </ImagePreview>
    </StyledCreateProduct>
  );
};

export default CreateProduct;

const StyledCreateProduct = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin-top: 2rem;
  justify-content: center;
  align-items: flex-start;
  select,
  input {
    padding: 7px;
    min-height: 30px;
    width: 100%;
    outline: none;
    border-radius: 5px;
    border: 1px solid rgb(182, 182, 182);
    margin: 0.3rem 0;
    &:focus {
      border: 1px solid rgb(0, 208, 255);
    }
  }
  select {
    color: rgb(95, 95, 95);
  }
`;

const ImagePreview = styled.div`
  margin: 1.8rem 0 2rem 2rem;
  padding: 2rem;
  border: 1px solid rgb(183, 183, 183);
  max-width: 300px;
  height: 377px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: rgb(78, 78, 78);

  img {
    max-width: 100%;
  }
`;

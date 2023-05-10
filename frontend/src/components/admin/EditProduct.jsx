import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import ToastAlert from "../common/ToastAlert";
import Resizer from "react-image-file-resizer";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { productsEdit } from "../../features/productsSlice";
import { PrimaryButton } from "./CommonStyled";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Button,
} from "@mui/material";
import { sizes } from "./CreateProduct";

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

export default function EditProduct({ prodId }) {
  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.products);

  const [currentProd, setCurrentProd] = useState({});
  const [previewimg, setPreviewimg] = useState("");

  const [productImg, setProductImg] = useState(null);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [productSize, setProductSize] = useState([]);

  // console.log(productImg);

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
          setPreviewimg(uri);
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

    dispatch(
      productsEdit({
        productImg,
        product: {
          currentProd,
          name,
          brand,
          price,
          desc,
          sizes: productSize,
        },
      })
    );
  };

  const handleClickOpen = () => {
    setOpen(true);

    let selectedProd = items.filter((item) => item._id === prodId)[0];
    // selectedProd = selectedProd[0];

    setCurrentProd(selectedProd);
    setPreviewimg(selectedProd.image.url);
    setProductImg("");

    setBrand(selectedProd.brand);
    // console.log(brand);
    setName(selectedProd.name);
    setPrice(selectedProd.price);
    setDesc(selectedProd.desc);
    setProductSize(selectedProd.sizes);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // console.log(brand);

  return (
    <div>
      <Button
        disableElevation
        variant="contained"
        color="primary"
        size="small"
        onClick={handleClickOpen}
      >
        Edit
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <StyledEditProduct>
            <StyledForm onSubmit={handleSubmit}>
              <h3>Create a Product </h3>
              <input
                type="file"
                accept="image/"
                onChange={handleProductImageUpload}
              />
              <select
                onChange={(e) => setBrand(e.target.value)}
                value={brand || ""}
                required
              >
                <option value="">Select Brand </option>
                <option value="nike">Nike </option>
                <option value="goldstar">GoldStar</option>
                <option value="addidas">Addidas </option>
                <option value="others">Others</option>
              </select>
              <input
                type="text"
                placeholder="Name"
                style={{ textTransform: "capitalize" }}
                value={name}
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <input
                type="text"
                placeholder="Short Description"
                value={desc}
                style={{ textTransform: "capitalize" }}
                onChange={(e) => setDesc(e.target.value)}
              />

              <PrimaryButton type="submit">Submit</PrimaryButton>
            </StyledForm>
            <ImagePreview>
              {previewimg ? (
                <>
                  <img src={previewimg} alt="product img " />
                </>
              ) : (
                <p>Image preview will appear here !</p>
              )}
            </ImagePreview>
          </StyledEditProduct>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const Edit = styled.button`
  border: none;
  outline: none;
  padding: 3px 5px;
  color: white;
  border-radius: 3px;
  cursor: pointer;
  background-color: #4b70e2;
`;

const StyledEditProduct = styled.div`
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
      border: 2px solid rgb(0, 208, 255);
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

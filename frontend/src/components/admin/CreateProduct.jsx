import { useState, PrimaryButton } from "react";
import styled from "styled-components";

const CreateProduct = () => {
  const [productImg, setProductImg] = useState();
  const [name, setName] = useState();
  const [brand, setBrand] = useState();
  const [price, setPrice] = useState();
  const [desc, setDesc] = useState();

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
  };
  const TransformFile = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProductImg(reader.result);
      };
    } else {
      setProductImg("");
    }
  };

  return (
    <StyledCreateProduct>
      <StyledForm>
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
          required
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Price"
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Short Description"
          onChange={(e) => setDesc(e.target.value)}
        />

        <PrimaryButton type="submit">Submit</PrimaryButton>
      </StyledForm>
      <ImagePreview>
        {productImg ? (
          <>
            <img src={productImg} alt="product img!" />
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
  justify-content: space-between;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-top: 2rem;
  select,
  input {
    padding: 7px;
    min-height: 30px;
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
  margin: 2rem 0 2rem 2rem;
  padding: 2rem;
  border: 1px solid rgb(183, 183, 183);
  max-width: 300px;
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

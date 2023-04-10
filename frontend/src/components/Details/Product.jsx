import { useParams } from "react-router-dom";
import styled from "styled-components";

const Product = () => {
  const params = useParams();

  return <StyledProduct>Product: {params.id}</StyledProduct>;
};

const StyledProduct = styled.div`
  display: flex;
  margin: 3rem;
  justify-content: center;
`;

const ProductContainer = styled.div`
  display: flex;
  max-width: 500px;
  height: auto;
  padding: 2rem;
  background: #fff;
  border-radius: 5px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

const ImageContainer = styled.div`
  flex: 1;
  img {
    width: 100%;
  }
`;

const ProductDetails = styled.div`
  flex: 2;
  margin-left: 2rem;
  h3 {
    font-size: 35px;
  }
  p span {
    font-weight: bold;
  }
`;

const Price = styled.div`
  font-size: 25px;
  font-weight: bold;
  margin: 1rem 0;
`;

export default Product;

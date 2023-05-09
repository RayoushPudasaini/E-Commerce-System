import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { orderCreate } from "../features/orderSlice";
import { clearCart } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";

function Cash() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderCreateStatus } = useSelector((state) => state.orders);
  const { cartItems } = useSelector((state) => state.cart);
  const { _id } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    state: "",
    phone: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(orderCreate(formData));

    // Handle form submission here
  };

  useEffect(() => {
    if (orderCreateStatus === "success") {
      setFormData({
        name: "",
        email: "",
        city: "",
        state: "",
        phone: "",
      });
      dispatch(clearCart());
      navigate(`/user-order-view/${_id}`, { replace: true });
    }
  }, [_id, dispatch, navigate, orderCreateStatus]);

  return (
    <Container>
      <Heading>
        {cartItems.length > 0
          ? "Please fill in your details to place your order"
          : "Your cart is empty"}
      </Heading>

      {cartItems.length < 1 && (
        <Button
          onClick={() => {
            navigate("/cart", { replace: true });
          }}
        >
          Go to Cart
        </Button>
      )}
      {cartItems.length > 0 ? (
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name"
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="city"
            value={formData.city}
            placeholder="City"
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="state"
            value={formData.state}
            placeholder="State"
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="phone"
            value={formData.phone}
            placeholder="Phone"
            onChange={handleChange}
            required
          />
          <Button type="submit">Submit</Button>
        </Form>
      ) : null}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Heading = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  margin-top: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 600px;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.2s ease-in-out;
  &:focus {
    outline: none;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
  }
`;

const Button = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: #0077cc;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: #005fa3;
  }
`;

export default Cash;

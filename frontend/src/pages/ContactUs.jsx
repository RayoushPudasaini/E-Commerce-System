import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import styled from "styled-components";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_5e9vwpo",
        "template_f750aid",
        form.current,
        "AFeA-n-1mCnJk07vx"
      )
      .then(
        (result) => {
          console.log(result.text);
          console.log("message sent");
          form.current.reset();
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <StyledContactForm>
      <StyledContent>
        <h1>Contact Us</h1>
        <StyledForm ref={form} onSubmit={sendEmail}>
          <label>Name</label>
          <input type="text" name="user_name" required />
          <label>Email</label>
          <input type="email" name="user_email" required />
          <label>Message</label>
          <textarea name="message" required />
          <input type="submit" value="Send" />
        </StyledForm>
      </StyledContent>
    </StyledContactForm>
  );
};

const StyledContactForm = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

const StyledContent = styled.div`
  text-align: center;
`;

const StyledForm = styled.form`
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;

  label {
    margin-top: 1rem;
  }

  input,
  textarea {
    width: 100%;
    height: 35px;
    padding: 7px;
    outline: none;
    border-radius: 5px;
    border: 1px solid rgb(220, 220, 220);

    &:focus {
      border: 2px solid rgba(0, 206, 158, 1);
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  input[type="submit"] {
    margin-top: 2rem;
    cursor: pointer;
    background: #4b70e2;
    color: white;
    border: none;
  }
`;

export default Contact;

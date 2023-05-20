import React from "react";

import styled from "styled-components";

function AboutUs() {
  return (
    <Container>
      <Title>About Us</Title>
      <Content>
        <p>
          Jutta Pasal is an innovative e-commerce company based in Kathmandu,
          Nepal. Established in 2021 by Rayush Pudasaini, a student from Herald
          College, the company is dedicated to providing genuine and
          high-quality shoes through its platform, connecting with renowned
          brands such as Adidas, Nike, and Puma. With an unwavering commitment
          to growth and expansion, Jutta Pasal plans to broaden its reach into
          other sectors in the near future.
        </p>
        <p>
          Beyond its impressive commercial endeavors, Jutta Pasal also sponsors
          the Nepal National Cricket Team, demonstrating its strong commitment
          to supporting and promoting sports and athletics. Additionally, the
          company donates approximately 15% of its profits to charity, working
          to improve the lives of those in need and contributing to the
          betterment of society as a whole.
        </p>
      </Content>
    </Container>
  );
}
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 3rem;
  margin-bottom: 2rem;
`;

const Content = styled.div`
  font-size: 1.5rem;
  line-height: 1.5;
  text-align: justify;

  & p {
    margin-bottom: 2rem;
  }
`;

export default AboutUs;

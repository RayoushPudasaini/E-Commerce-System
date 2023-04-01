import { useSelector } from "react-redux";
import info from "./AllTimeData";

import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import { setHeaders, url } from "../../../features/api";

const AlltimeData = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const { items } = useSelector((state) => state.products);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/users/stats`, setHeaders());

        if (res?.data?.totalUsers) {
          setTotalUsers(res?.data?.totalUsers);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  return (
    <Main>
      <h3>All Time</h3>
      <InfoWrapper>
        <Title>Users</Title>
        <Data>{totalUsers}</Data>
      </InfoWrapper>
      <InfoWrapper>
        <Title>Products</Title>
        <Data>{items.length}</Data>
      </InfoWrapper>
      <InfoWrapper>
        <Title>Orders</Title>
        <Data>200</Data>
      </InfoWrapper>
      <InfoWrapper>
        <Title>Earnings</Title>
        <Data>$20,000</Data>
      </InfoWrapper>
    </Main>
  );
};

export default AlltimeData;

const Main = styled.div`
  background: rgb(48, 51, 78);
  color: rgba(234, 234, 255, 0.8);
  margin-top: 1.5rem;
  border-radius: 5px;
  padding: 1rem;
  font-size: 14px;
`;

const InfoWrapper = styled.div`
  display: flex;
  margin: 1rem;
  padding: 0.3 rem;
  border-radius: 3px;
  background: rgba(38, 198, 249, 0.12);
  &:nth-child(even) {
    background: rgb(102, 108, 255, 0.12);
  }
`;

const Title = styled.div`
  flex: 1;
`;
const Data = styled.div`
  flex: 1;
  font-weight: 700;
`;

import { useSelector } from "react-redux";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import { setHeaders, url } from "../../../features/api";

const AlltimeData = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const { items } = useSelector((state) => state.products);

  useEffect(() => {
    async function fetchData() {
      try {
        const usersRes = await axios.get(`${url}/users/stats`, setHeaders());

        if (usersRes?.data && usersRes.status === 200) {
          // const { total } = usersRes.data[0]; // extract the 'total' field from the first object in the array
          setTotalUsers(usersRes.data.totalUsers);
        }

        const ordersRes = await axios.get(`${url}/orders/stats`, setHeaders());
        if (ordersRes?.data && ordersRes.data.length > 0) {
          const { total } = ordersRes.data[0];
          setTotalOrders(total);
        }

        const earningsRes = await axios.get(
          `${url}/orders/income/stats`,
          setHeaders()
        );

        if (earningsRes?.data && earningsRes.data.length > 0) {
          const { total } = earningsRes.data[0];
          setTotalEarnings(total);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();

    // set interval to update data every 5 minutes
    const interval = setInterval(() => {
      fetchData();
    }, 300000);

    // cleanup function to clear interval when component unmounts
    return () => clearInterval(interval);
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
        <Data>{totalOrders}</Data>
      </InfoWrapper>
      <InfoWrapper>
        <Title>Earnings</Title>
        <Data>{`$${totalEarnings}`}</Data>
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

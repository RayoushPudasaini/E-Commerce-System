import styled from "styled-components";
import { useEffect, useState } from "react";
import { setHeaders, url } from "../../../features/api";
import axios from "axios";

import moment from "moment";

//useEffect for fetching our orders
const Transactions = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/orders/?new=true`, setHeaders());
        setIsLoading(true);
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    }

    fetchData();
  }, []);

  return (
    <StyledTransactions>
      {isLoading ? (
        <p>Transactions loading...</p>
      ) : (
        <>
          <h3>Latest Transactions</h3>

          {orders
            .slice(-5)
            .reverse()

            .map((order, index) => (
              <Transaction key={index}>
                <p>{order.shipping.name}</p>
                <p>${order.total.toLocaleString()}</p>
                <p>{moment(order.createdAt).fromNow()}</p>
              </Transaction>
            ))}
        </>
      )}
    </StyledTransactions>
  );
};

export default Transactions;

const StyledTransactions = styled.div`
  background: rgb(48, 51, 78);
  color: rgba(234, 234, 255, 0.8);
  padding: 1rem;
  border-radius: 5px;
`;

const Transaction = styled.div`
  display: flex;
  font-size: 14px;
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 3px;
  background: rgb(38, 198, 249, 0.12);
  p {
    flex: 1;
  }
  &:nth-child(even) {
    background: rgb(102, 108, 255, 0.12);
  }
`;

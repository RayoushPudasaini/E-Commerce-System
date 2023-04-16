import { useState, useEffect } from "react";
import styled from "styled-components";
import { FaUser } from "react-icons/fa";
import { IoIosClipboard } from "react-icons/io";
import { BsBarChartLineFill } from "react-icons/bs";
import Widget from "./summary-components/Widget";
import axios from "axios";
import { setHeaders, url } from "../../features/api";
import Chart from "./summary-components/Chart";
import Transactions from "./summary-components/Transactions";
import AlltimeData from "./summary-components/AllTimeData";

const Summary = () => {
  const [users, setUsers] = useState([]);
  const [usersPerc, setUsersPerc] = useState(0);
  const [orders, setOrders] = useState([]);
  const [ordersPerc, setOrdersPerc] = useState(0);
  const [income, setIncome] = useState([]);
  const [incomePerc, setIncomePerc] = useState(0);

  function compare(a, b) {
    if (a._id < b._id) {
      return 1;
    }
    if (a._id > b._id) {
      return 1;
    }
    return 0;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/users/stats`, setHeaders());

        res?.data?.users?.sort(compare);
        setUsers(res?.data);
        setUsersPerc(
          (res?.data.users[0]?.total -
            res?.data.users[1]?.total / res?.data.users[1]?.total) *
            100
        );
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  //use effect for orders

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/orders/stats`, setHeaders());
        console.log("res", res.data);

        res?.data?.sort(compare);

        console.log("stats", res);
        if (res?.data[0]?.total) {
          setOrders(res.data);
        }
        if (res?.data[1]?.total) {
          setOrders(res.data);
          setOrdersPerc(
            (res?.data[0]?.total - res?.data[1]?.total / res?.data[1]?.total) *
              100
          );
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  //use effect for income

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/orders/income/stats`, setHeaders());

        res.data.sort(compare);

        console.log("stats", res.data);
        setIncome(res.data);
        setIncomePerc(
          (res?.data[0]?.total - res?.data[1]?.total / res?.data[1]?.total) *
            100
        );
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  const data = [
    {
      icon: <FaUser />,
      digits: users?.totalUsers,
      isMoney: false,
      title: "Users",
      color: "rgb(102, 108, 255)",
      bgColor: "rgba(102, 108, 0.12)",
      percentage: usersPerc ? usersPerc : 0,
    },

    {
      icon: <IoIosClipboard />,
      digits: orders[0]?.total,
      isMoney: false,
      title: "Orders",
      color: "rgb(38, 198, 249)",
      bgColor: "rgba(38, 198, 249,  0.12)",
      percentage: ordersPerc ? ordersPerc : 0,
    },
    {
      icon: <BsBarChartLineFill />,
      digits: income[0]?.total ? income[0]?.total : "",

      isMoney: true,
      title: "Earnings",
      color: "rgb(253, 181, 40)",
      bgColor: "rgba(253, 181, 40, 0.12)",
      percentage: incomePerc ? incomePerc : 0,
    },
  ];

  return (
    <StyledSummary>
      <Mainstats>
        <Overview>
          <Title>
            <h2>Overview</h2>
            <p>How your shop is performing compared to the previous month. </p>
          </Title>
          <WidgetWrapper>
            {data?.map((data, index) => (
              <Widget key={index} data={data} />
            ))}
          </WidgetWrapper>
        </Overview>
        <Chart />
      </Mainstats>
      <SideStats>
        <Transactions />
        <AlltimeData />
      </SideStats>
    </StyledSummary>
  );
};

export default Summary;

const StyledSummary = styled.div`
  width: 100%;
  display: flex;
`;
const Mainstats = styled.div`
  flex: 2;
  width: 100%;
`;

const Title = styled.div`
  p {
    font-size: 14px;
    color: black;
  }
`;

const Overview = styled.div`
  width: 100%;
  padding: 1.5rem;
  background-color: rgba(234, 234, 255, 0.87);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; ;
`;

const WidgetWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 0.5rem;
`;

const SideStats = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
  width: 100%;
`;

import styled from "styled-components";
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { productDelete } from "../../../features/productsSlice";
import axios from "axios";
import { setHeaders, url } from "../../../features/api";
import moment from "moment";
import { ordersFetch } from "../../../features/orderSlice";
import { Chip } from "@mui/material";

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  button {
    border: none;
    outline: none;
    padding: 3px 5px;
    border-radius: 3px;
    cursor: pointer;
  }
`;

const DispatchBtn = styled.button`
  background-color: rgb(38, 198, 249);
`;

const DeliveryBtn = styled.button`
  background-color: rgb(102, 108, 255);
`;

const ViewBtn = styled.button`
  background-color: rgb(144, 255, 40);
`;

const PendingBtn = styled.button`
  color: rgb(253, 181, 40);
  background: rgba(253, 181, 40, 0.12;
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

const DispatchedBtn = styled.button`
  color: rgb(38, 198, 249);
  background: rgba(38, 198, 249, 0.1);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

const DeliveredBtn = styled.button`
  color: rgb(102, 108, 255);
  background-color: rgba(102, 108, 255, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

export default function OrdersList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.orders);

  React.useEffect(() => {
    dispatch(ordersFetch());
  }, [dispatch]);

  const rows = list?.map((order) => {
    return {
      id: order._id,
      cName: order.shipping.name,
      amount: (order.total / 100)?.toLocaleString(),
      dStatus: order.delivery_status,
      date: moment(order.createdAt).format("DD/MM/YYYY"),
    };
  });

  const columns = [
    { field: "id", headerName: "ID", width: 220 },
    {
      field: "cName",
      headerName: "Name",
      width: 180,
    },
    {
      field: "amount",
      headerName: "Amount($)",
      width: 100,
    },
    {
      field: "dStatus",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        return (
          <div>
            {params.row.dStatus === "pending" ? (
              <Chip label="Pending" color="secondary" />
            ) : params.row.dStatus === "dispatched" ? (
              <Chip label="Dispatched" color="primary" />
            ) : params.row.dStatus === "delivered" ? (
              <Chip label="Delivered" color="success" />
            ) : (
              "error"
            )}
          </div>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      width: 120,
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      width: 270,
      renderCell: (params) => {
        return (
          <Actions>
            <Chip label="Pending" color="warning" />
            <Chip label="Dispatched" color="primary" />
            <Chip label="Delivered" color="success" />
          </Actions>
        );
      },
    },
  ];

  return (
    <div style={{ height: 450, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
}

import styled from "styled-components";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { ordersFetch, orderEdit } from "../../../features/orderSlice";
import { Button, Chip } from "@mui/material";

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export default function OrdersList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.orders);

  React.useEffect(() => {
    dispatch(ordersFetch());
  }, [dispatch]);

  let rows = list?.map((order) => {
    console.log(order);
    return {
      id: order._id,
      cName: order.shipping.name,
      amount: order.total?.toLocaleString(),
      dStatus: order.delivery_status,
      date: moment(order.createdAt).fromNow(),
      deliveryDate: moment(order.delivery_date).format("YYYY-MM-DD"),
    };
  });

  rows = rows?.slice(0).reverse();

  const columns = [
    {
      field: "id",
      headerName: "Id",
      width: 150,
    },
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
      field: "deliveryDate",
      headerName: "DeliveryDate",

      width: 110,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 400,
      renderCell: (params) => {
        return (
          <Actions>
            <Button
              disableElevation
              variant="contained"
              color="warning"
              size="small"
              onClick={() => handleOrderDispatch(params.row.id)}
            >
              Dispatch{" "}
            </Button>

            <Button
              disableElevation
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleOrderDeliver(params.row.id)}
            >
              Delivery
            </Button>

            <Button
              disableElevation
              variant="contained"
              color="success"
              size="small"
              onClick={() => {
                navigate(`/order-view/${params.row.id}`);
              }}
            >
              View
            </Button>
          </Actions>
        );
      },
    },
  ];

  const handleOrderDispatch = (id) => {
    dispatch(
      orderEdit({
        id,
        delivery_status: "dispatched",
      })
    );
  };
  const handleOrderDeliver = (id) => {
    dispatch(
      orderEdit({
        id,
        delivery_status: "delivered",
      })
    );
  };

  return (
    <div style={{ height: 580, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination={true}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
          rowsPerPage: 10,
        }}
        pageSizeOptions={[10, 20, 30]}
        checkboxSelection={false}
        disableSelectionOnClick
      />
    </div>
  );
}

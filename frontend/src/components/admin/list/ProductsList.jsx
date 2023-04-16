import styled from "styled-components";
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { productDelete } from "../../../features/productsSlice";
import axios from "axios";
import { setHeaders, url } from "../../../features/api";
import moment from "moment";

export default function ProductsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { items } = useSelector((state) => state.products);
  const [users, setUsers] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);

  const deleteUser = React.useCallback(
    async function deleteUser(id) {
      if (!id) return;
      if (window.confirm("Are you sure you want to delete this product?")) {
        const res = await axios.delete(`${url}/users/${id}`, setHeaders());

        if (res.status === 200) {
          const filteredData = users.filter((user) => user._id !== id);
          setUsers(filteredData);
        }
      }
    },
    [users]
  );

  const handleDelete = React.useCallback(
    (id) => {
      if (!id) return;
      if (window.confirm("Are you sure you want to delete this product?")) {
        dispatch(productDelete(id));
      }
    },
    [dispatch]
  );

  const usersColumn = React.useCallback(
    () => [
      { field: "id", headerName: "ID", width: 220 },
      {
        field: "name",
        headerName: "Name",
        width: 180,
      },
      {
        field: "email",
        headerName: "Email",
        width: 250,
      },
      {
        field: "isAdmin",
        headerName: "isAdmin",
        width: 130,
      },
      {
        field: "createdAt",
        headerName: "createdAt",
        width: 180,
        renderCell: (params) => {
          return (
            <span>
              {moment(params.row.createdAt).format("DD MMM YYYY, hh:mm a")}
            </span>
          );
        },
      },
      {
        field: "action",
        headerName: "Action",
        width: 100,
        renderCell: (params) => {
          return (
            <Actions>
              <Delete onClick={() => deleteUser(params.row.id)}>Delete</Delete>
            </Actions>
          );
        },
      },
    ],
    [deleteUser]
  );
  // const usersRows = users?.map((user) => {
  //   const { _id, name, email, isAdmin, createdAt } = user;
  //   return {
  //     id: _id,
  //     name: name,
  //     email: email,
  //     isAdmin: isAdmin,
  //     createdAt: createdAt,
  //   };
  // });

  const usersRows = React.useMemo(
    () =>
      users?.map((user) => {
        const { _id, name, email, isAdmin, createdAt } = user;
        return {
          id: _id,
          name: name,
          email: email,
          isAdmin: isAdmin,
          createdAt: createdAt,
        };
      }),
    [users]
  );

  // const productsRows =
  //   items &&
  //   items.map((item) => {
  //     return {
  //       id: item._id,
  //       imageUrl: item.image.url,
  //       pName: item.name,
  //       pDesc: item.desc,
  //       pPrice: item.price.toLocaleString(),
  //     };
  //   });

  const productsRows = React.useMemo(
    () =>
      items &&
      items.map((item) => {
        return {
          id: item._id,
          imageUrl: item.image.url,
          pName: item.name,
          pDesc: item.desc,
          pPrice: item.price.toLocaleString(),
        };
      }),
    [items]
  );

  const productsColumn = React.useCallback(
    () => [
      { field: "id", headerName: "ID", width: 210 },
      {
        field: "imageUrl",
        headerName: "Image",
        width: 80,
        renderCell: (params) => {
          return (
            <ImageContainer>
              <img src={params.row.imageUrl} alt="params.row.imageUrl" />
            </ImageContainer>
          );
        },
      },
      { field: "pName", headerName: "Name", width: 250 },
      {
        field: "pDesc",
        headerName: "Description",
        width: 340,
      },
      {
        field: "pPrice",
        headerName: "Price",
        width: 80,
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        width: 120,
        renderCell: (params) => {
          return (
            <Actions>
              <Delete onClick={() => handleDelete(params.row.id)}>
                Delete
              </Delete>
              <View onClick={() => navigate(`/product/${params.row.id}`)}>
                View
              </View>
            </Actions>
          );
        },
      },
    ],
    [handleDelete, navigate]
  );

  React.useEffect(() => {
    if (pathname === "/admin/users") {
      setColumns(usersColumn);
      setRows(usersRows);
    } else {
      setColumns(productsColumn);
      setRows(productsRows);
    }
  }, [pathname, usersColumn, usersRows, productsColumn, productsRows]);

  React.useEffect(() => {
    async function getUsers() {
      const res = await axios.get(
        "http://localhost:5000/api/users",
        setHeaders()
      );
      if (res.status === 200) {
        setUsers(res.data);
      }
    }
    if (pathname === "/admin/users") {
      getUsers();
    }
    return () => {
      setUsers([]);
    };
  }, [pathname]);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection={false}
        pagination={true}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
          rowsPerPage: 5,
        }}
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  );
}

const ImageContainer = styled.div`
  img {
    height: 100%;
    width: 100%;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100px;
  button {
    border: none;
    outline: none;
    padding: 3px, 5px;
    color: white;
    border-radius: 3px;
    cursor: pointer;
  }
`;

const Delete = styled.button`
  background-color: rgb(255, 77, 73);
  padding: 5px 6px;
`;

const View = styled.button`
  background-color: rgb(114, 225, 40);
  padding: 5px 6px;
`;

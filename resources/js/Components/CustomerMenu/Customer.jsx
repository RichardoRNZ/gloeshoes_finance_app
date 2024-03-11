import React, { useState, useEffect } from "react";
import {
    Breadcrumbs,
    Button,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import { Add, Download, Group, Save } from "@mui/icons-material";
import AddCustomerForm from "./AddCustomerForm";
import Datatable from "../Datatable";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../Loading";
import ConfirmModal from "../ConfirmModal";

const Customer = (props) => {
    const columns = [
        { field: "no", headerName: "No", width: 70 },
        {
            field: "name",
            headerName: "Customer Name",
            width: 150,
            editable: true,
        },
        { field: "address", headerName: "Address", width: 270, editable: true },
        {
            field: "phoneNumber",
            headerName: "Phone",
            width: 150,
            editable: true,
        },
        { field: "email", headerName: "Email", width: 220, editable: true },
        {
            field: "instagram",
            headerName: "Instagram Account",
            width: 150,
            editable: true,
        },
    ];
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [rowCount, setRowCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 1,
    });
    const [search, setSearch] = useState("");
    const [showLoading,setShowLoading] = useState(false);
    const [rowId, setRowId] = useState(0);

    console.log(props);
    useEffect(() => {
        fetchCustomersData();
    }, [props.ziggy.location, paginationModel, search]);

    const fetchCustomersData = async (
        page = paginationModel.page,
        size = paginationModel.pageSize
    ) => {
        try {
            setIsLoading(true);
            const response = await axios.get("/customers", {
                params: {
                    perPage: size,
                    page: page,
                    search: search,
                },
            });
            setRows(response.data.data);
            setRowCount(response.data.total);
            setIsLoading(false);
        } catch (error) {}
    };
    const deleteCustomerData = async (id) => {
        try {
            const response = await axios.delete("/customers/" + id);
            Swal.fire({
                icon: "success",
                title: response.data.message,
                timer: 1500,
            });
            fetchCustomersData();
        } catch (error) {
            Swal.fire({
                title: "Oops",
                text: error.response.data,
                icon: "error",
                timer: 1500,
            });
        }
    };
    const handleDeleteClick = async (id) => {
        setShowLoading(true);
        await deleteCustomerData(id);
        setRowId(0);
        setShowLoading(false);


    };

    console.log(paginationModel);
    console.log(search);
    console.log("rowId",rowId)
    return (
        <>
            <Loading isLoading={showLoading} />
            <div className="container">
                <div className="mb-4">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="none"
                            color="#2B316A"
                            href={route("dashboard")}
                        >
                            Home
                        </Link>
                        <Typography color="#2B316A" sx={{ fontWeight: "600" }}>
                            Customers
                        </Typography>
                    </Breadcrumbs>
                </div>
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-12">
                        <div className="card" style={{ width: "100%" }}>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <Group /> Customer List
                                </h5>

                                <div className="d-flex justify-content-end button-group mb-4">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        sx={{ marginRight: "10px" }}
                                    >
                                        <Download />
                                        Download
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{ marginRight: "10px" }}
                                    >
                                        <Save />
                                        Save Update
                                    </Button>
                                    <Button
                                        variant="contained"
                                        className="mr-4"
                                        data-bs-toggle="modal"
                                        data-bs-target="#customerModal"
                                    >
                                        <Add />
                                        Add Customer
                                    </Button>
                                </div>
                                <div className="d-flex justify-content-end mb-2">
                                    <TextField
                                        id="standard-basic"
                                        label="Search"
                                        variant="standard"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="row">
                                    <Datatable
                                        rows={rows}
                                        columns={columns}
                                        setRows={setRows}
                                        isLoading={isLoading}
                                        rowCount={rowCount}
                                        paginationModel={paginationModel}
                                        setPaginationModel={setPaginationModel}
                                        setRowId={setRowId}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddCustomerForm
                user={props.auth.user.username}
                getCustomer={fetchCustomersData}
            />
             <ConfirmModal
                id="deleteModal"
                type="delete"
                text="Are you sure want to delete?"
                handleClick={()=>handleDeleteClick(rowId)}
            />
        </>
    );
};

export default Customer;

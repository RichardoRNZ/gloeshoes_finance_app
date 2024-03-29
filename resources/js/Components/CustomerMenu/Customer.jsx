import React, { useState, useEffect } from "react";
import {
    Breadcrumbs,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import { Group } from "@mui/icons-material";
import AddCustomerForm from "./AddCustomerForm";
import Datatable from "../Datatable";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../Loading";
import ConfirmModal from "../ConfirmModal";
import HeaderTableButton from "../HeaderTableButton";
import Product from "../ProductMenu/Product";

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
        page: 0,
    });
    const [search, setSearch] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [rowId, setRowId] = useState(0);
    const [isUpdated, setIsUpdated] = useState(false);


    useEffect(() => {
        fetchCustomersData();
    }, [props.ziggy.location, paginationModel, search]);

    const fetchCustomersData = async (
        page = paginationModel.page+1,
        size = paginationModel.pageSize
    ) => {
        try {
            setIsLoading(true);
            const response = await axios.get("/customer/all", {
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
    const updateCustomerData = async () => {
        try {

            const response = await axios.put("/customers/update", rows);
            Swal.fire({
                icon: "success",
                title: response.data.message,
                timer: 1500,
            });
            fetchCustomersData();
            setIsUpdated(false);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops",
                text : error.response.data,
                timer: 1500,
            });
            setIsUpdated(true);
        }
    };
    const handleSaveUpdateClick = async () => {
        setShowLoading(true);
        await updateCustomerData();
        setShowLoading(false);
    };
    const handleDiscardChanges = () => {
        fetchCustomersData();
        Swal.fire({
            icon: "success",
            title: "Successfully discard changes",
            timer: 1500,
        });
        setIsUpdated(false);
    }


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
                                   <HeaderTableButton isUpdated={isUpdated} addButton="#customerModal" typeAddButton="Add Customer"/>
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
                                        setIsUpdated={setIsUpdated}
                                        type="customer"
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
                handleClick={() => handleDeleteClick(rowId)}
            />
             <ConfirmModal
                id="updateModal"
                type="update"
                text="Are you sure want to save?"
                handleClick={() => handleSaveUpdateClick()}
            />
             <ConfirmModal
                id="discardModal"
                type="delete"
                text="Are you sure want to discard this change? Any changes will be lost"
                handleClick={() => handleDiscardChanges()}
            />

        </>
    );
};

export default Customer;

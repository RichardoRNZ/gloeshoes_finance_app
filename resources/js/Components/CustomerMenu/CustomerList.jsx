import React, { useState, useEffect } from "react";
import { Breadcrumbs, Link, TextField, Typography } from "@mui/material";
import { Group } from "@mui/icons-material";
import AddCustomerForm from "./AddCustomerForm";
import Datatable from "../Datatable";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../Loading";
import ConfirmModal from "../ConfirmModal";
import HeaderTableButton from "../HeaderTableButton";
import Product from "../ProductMenu/ProductList";
import FileSaver from "file-saver";
import { set } from "lodash";
import Error from "@/Pages/Error";

const Customer = (props) => {
    const columns = [
        { field: "no", headerName: "No", width: 70, sortable: false },
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
            sortable: false,
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
    const [sortModel, setSortModel] = useState([]);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        fetchCustomersData();
    }, [props.ziggy.location, paginationModel, search, sortModel]);

    const fetchCustomersData = async (
        page = paginationModel.page + 1,
        size = paginationModel.pageSize
    ) => {
        try {
            setIsLoading(true);
            const response = await axios.get("/customer/all", {
                params: {
                    perPage: size,
                    page: page,
                    search: search,
                    order: sortModel,
                },
            });
            setRows(response.data.data);
            setRowCount(response.data.total);
        } catch (error) {
            setHasError(true);
            setTimeout(() => {
                throw error;
            });
        } finally {
            setIsLoading(false);
        }
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
    const downloadCustomersData = async () => {
        try {
            const response = await axios.get("/customers/export", {
                responseType: "blob",
            });
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            FileSaver.saveAs(blob, "customers.xlsx");
        } catch (error) {
            Swal.fire({
                title: "Oops",
                text: "Failed download data",
                icon: "error",
                timer: 1500,
            });
        }
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
                text: error.response.data,
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
    };

    console.log(sortModel);

    return (
        <>
            {/* {hasError && <Error />} */}

            <Loading isLoading={showLoading} />
            { (
                <div className="container">
                    <div className="mb-4">
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                                underline="none"
                                color="#243ab0"
                                href={route("dashboard")}
                            >
                                Home
                            </Link>
                            <Typography
                                color="#243ab0"
                                sx={{ fontWeight: "600" }}
                            >
                                Customers
                            </Typography>
                        </Breadcrumbs>
                    </div>
                    <div className="row align-items-center justify-content-center">
                        <div className="col-lg-12">
                            <div
                                className="card shadow-sm"
                                style={{ width: "100%" }}
                            >
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <Group /> Customer List
                                    </h5>

                                    <div className="d-flex justify-content-end button-group mb-4">
                                        <HeaderTableButton
                                            isUpdated={isUpdated}
                                            addButton="#customerModal"
                                            typeAddButton="customer"
                                            download={downloadCustomersData}
                                        />
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
                                            setPaginationModel={
                                                setPaginationModel
                                            }
                                            setRowId={setRowId}
                                            setIsUpdated={setIsUpdated}
                                            type="customer"
                                            sortModel={sortModel}
                                            setSortModel={setSortModel}
                                            isUpdated={isUpdated}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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

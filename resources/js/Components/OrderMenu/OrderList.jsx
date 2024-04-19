import { Inertia } from "@inertiajs/inertia";
import { Receipt } from "@mui/icons-material";
import { Breadcrumbs, Chip, Link, TextField, Typography } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import ConfirmModal from "../ConfirmModal";
import Datatable from "../Datatable";
import HeaderTableButton from "../HeaderTableButton";
import Loading from "../Loading";
import OrderForm from "./OrderForm";

const OrderList = (props) => {
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
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const columns = [
        { field: "no", headerName: "No", width: 70 },
        {
            field: "orderNumber",
            headerName: "Order ID",
            width: 200,
        },
        {
            field: "customerName",
            headerName: "Customer Name",
            width: 150,
        },
        {
            field: "paymentStatus",
            headerName: "Payment Status",
            width: 130,
            renderCell: (params) => (
                <Chip
                    color={
                        params.value.toLowerCase() === "not paid"
                            ? "error"
                            : params.value === "not yet paid off"
                            ? "secondary"
                            : "success"
                    }
                    label={params.value.toUpperCase()}
                />
            ),
        },
        {
            field: "orderDate",
            headerName: "Order Date",
            width: 150,
            valueFormatter: (params) =>
                dayjs(params?.value).format("DD MMMM YYYY"),
        },
        {
            field: "orderStatus",
            headerName: "Order Status",
            width: 150,
            renderCell: (params) => (
                <Chip
                    color={
                        params.value.toLowerCase() === "created"
                            ? "warning"
                            : params.value.toLowerCase() === "on progress"
                            ? "secondary"
                            : params.value.toLowerCase() === "on delivery"
                            ? "primary"
                            : "success"
                    }
                    label={params.value.toUpperCase()}
                />
            ),
        },
        {
            field: "totalPrice",
            headerName: "Total Price",
            width: 150,
        },
    ];
    useEffect(() => {
        fetchOrdersData();
    }, [props.ziggy.location, paginationModel, search]);
    const fetchOrdersData = async (
        page = paginationModel.page + 1,
        size = paginationModel.pageSize
    ) => {
        try {
            setIsLoading(true);
            const response = await axios.get("/order", {
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
    const getAllCustomers = async () => {
        try {
            const response = await axios.get("/customers/data");
            setCustomers(response.data);
        } catch (error) {}
    };
    const getAllProducts = async () => {
        try {
            const response = await axios.get("/products/data");
            setProducts(response.data);
        } catch (error) {}
    };
    const handleAddClick = () => {
        if (customers.length === 0) {
            getAllCustomers();
        }
        if (products.length === 0) {
            getAllProducts();
        }
    };

    const handleDetailClick = (id) => {
        Inertia.visit(route("detail_page", id));
    };
    const handleDeleteClick = async () => {
        try {
            setShowLoading(true);
            const response = await axios.delete("/order/delete/" + rowId);
            Swal.fire({
                icon: "success",
                title: response.data.message,
                timer: 1500,
            });
            fetchOrdersData();
            setShowLoading(false);
        } catch (error) {
            Swal.fire({
                title: "Oops",
                text: error.response.data,
                icon: "error",
                timer: 1500,
            });
            setIsLoading(false);
        }
    };

    console.log(customers);
    return (
        <>
        <Loading isLoading={showLoading}/>
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
                        <Typography color="#243ab0" sx={{ fontWeight: "600" }}>
                            Orders
                        </Typography>
                    </Breadcrumbs>
                </div>
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-12">
                        <div className="card" style={{ width: "100%" }}>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <Receipt /> Order List
                                </h5>

                                <div className="d-flex justify-content-end button-group mb-4">
                                    <HeaderTableButton
                                        isUpdated={isUpdated}
                                        addButton="#orderModal"
                                        typeAddButton="order"
                                        handleClick={handleAddClick}
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
                                        setPaginationModel={setPaginationModel}
                                        setRowId={setRowId}
                                        setIsUpdated={setIsUpdated}
                                        type="order"
                                        handleDetailClick={handleDetailClick}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <OrderForm
                customers={customers}
                products={products}
                user={props.auth.user.username}
                fetchOrdersData={fetchOrdersData}
            />
            <ConfirmModal
                id="deleteModal"
                type="delete"
                text="Are you sure want to delete this order, the order data will be removed?"
                handleClick={() => handleDeleteClick()}
            />
        </>
    );
};

export default OrderList;

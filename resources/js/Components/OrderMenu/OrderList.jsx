import Error from "@/Pages/Error";
import { Inertia } from "@inertiajs/inertia";
import { Receipt } from "@mui/icons-material";
import {
    Breadcrumbs,
    Button,
    Chip,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import FileSaver from "file-saver";
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
    const [sortModel, setSortModel] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [selectionModel, setSelectionModel] = useState([]);
    const columns = [
        { field: "no", headerName: "No", width: 70,sortable:false, },
        {
            field: "order_number",
            headerName: "Order ID",
            width: 200,
        },
        {
            field: "customer_name",
            headerName: "Customer Name",
            width: 150,
            sortable:false,
        },
        {
            field: "payment_status",
            headerName: "Payment Status",
            width: 130,
            sortable:false,

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
            field: "date",
            headerName: "Order Date",
            width: 150,
            valueFormatter: (params) =>
                dayjs(params?.value).format("DD MMMM YYYY"),
        },
        {
            field: "order_status",
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
            sortable:false,
        },
    ];
    useEffect(() => {
        fetchOrdersData();
    }, [props.ziggy.location, paginationModel, search, sortModel]);
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
                    order : sortModel
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
    const handleOrderVendorFormDownload = async () => {
        const params = { transactionIds: selectionModel };
        try {
            const response = await axios.post(
                "/order/vendor/download",
                params,
                {
                    responseType: "blob",
                }
            );
            const blob = new Blob([response.data], { type: "application/pdf" });
            const fileName = response.headers
                .get("content-disposition")
                .split('"')[1];
            FileSaver.saveAs(blob, fileName);
        } catch (error) {}
    };

    return (
        <>
        {hasError && <Error/>}
            <Loading isLoading={showLoading} />
            {!hasError && (
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
                                Orders
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
                                        <Receipt /> Order List
                                    </h5>

                                    <div className="d-flex justify-content-end button-group mb-4">
                                        {selectionModel.length > 0 && (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                sx={{ marginRight: "10px" }}
                                                onClick={() => {
                                                    handleOrderVendorFormDownload();
                                                }}
                                            >
                                                Print Vendor Order Form
                                            </Button>
                                        )}
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
                                            setPaginationModel={
                                                setPaginationModel
                                            }
                                            setRowId={setRowId}
                                            setIsUpdated={setIsUpdated}
                                            type="order"
                                            handleDetailClick={
                                                handleDetailClick
                                            }
                                            selectionModel={selectionModel}
                                            setSelectionModel={
                                                setSelectionModel
                                            }
                                            sortModel={sortModel}
                                            setSortModel={setSortModel}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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

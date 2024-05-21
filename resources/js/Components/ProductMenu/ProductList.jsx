import Error from "@/Pages/Error";
import { Inventory2, UploadFile } from "@mui/icons-material";
import {
    Breadcrumbs,
    Button,
    Chip,
    IconButton,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import FileSaver from "file-saver";
import { MuiFileInput } from "mui-file-input";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import ConfirmModal from "../ConfirmModal";
import Datatable from "../Datatable";
import HeaderTableButton from "../HeaderTableButton";
import Loading from "../Loading";
import ProductForm from "./ProductForm";

const Product = (props) => {
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
    const [isNew, setIsNew] = useState(true);
    const [product, setProduct] = useState("");
    const [sortModel, setSortModel] = useState([]);
    const [hasError, setHasError] = useState(false);

    const columns = [
        { field: "no", headerName: "No", width: 70,  sortable:false, },
        { field: "sku", headerName: "SKU", width: 150 },
        {
            field: "name",
            headerName: "Product Name",
            width: 150,
        },
        {
            field: "price",
            headerName: "Price",
            width: 100,
        },
        {
            field: "cost",
            headerName: "Cost of Good Sold",
            width: 150,
        },
        { field: "stock", headerName: "Stock", width: 80 },
        {
            field: "status",
            headerName: "Status",
            width: 150,
            sortable:false,
            renderCell: (params) => (
                <Chip
                    color={
                        params.value === "Out of stock"
                            ? "error"
                            : params.value === "Low stock"
                            ? "warning"
                            : "success"
                    }
                    label={params.value.toUpperCase()}
                />
            ),
        },
        {
            field: "image",
            headerName: "Image",
            width: 200,
            sortable:false,

            renderCell: (params) => (
                <img src={params.value} className="h-100 w-50" />
            ),
        },
    ];

    useEffect(() => {
        fetchProductsData();
    }, [props.ziggy.location, paginationModel, search, sortModel]);

    const fetchProductsData = async (
        page = paginationModel.page + 1,
        size = paginationModel.pageSize
    ) => {
        try {
            setIsLoading(true);
            const response = await axios.get("/product/all", {
                params: {
                    perPage: size,
                    page: page,
                    search: search,
                    order : sortModel
                },
            });
            setRows(response.data.data);
            setRowCount(response.data.total);
            setIsLoading(false);
        } catch (error) {
            setHasError(true);
            setTimeout(() => {
                throw error;
            });
        } finally {
            setIsLoading(false);
        }
    };
    const getProductDetails = async (id) => {
        try {
            const response = await axios.get("/product/" + id);
            setProduct(response.data);
        } catch (error) {}
    };

    const handleEditClick = (id) => {
        setIsNew(false);
        getProductDetails(id);
    };
    const deleteProduct = async () => {
        try {
            const response = await axios.delete("/product/delete/" + rowId);

            Swal.fire({
                icon: "success",
                title: response.data.message,
                timer: 1500,
            });
            fetchProductsData();
        } catch (error) {
            Swal.fire({
                title: "Oops",
                text: error.response.data,
                icon: "error",
                timer: 1500,
            });
        }
    };
    const handleDeleteClick = async () => {
        setShowLoading(true);
        await deleteProduct();
        setShowLoading(false);
    };
    const downloadproductsData = async () => {
        try {
            const response = await axios.get("/products/export", {
                responseType: "blob",
            });
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            FileSaver.saveAs(blob, "products.xlsx");
        } catch (error) {}
    };

    return (
        <>
            <ConfirmModal
                id="deleteModal"
                type="delete"
                text="Are you sure want to delete?"
                handleClick={() => handleDeleteClick()}
            />
            <Loading isLoading={showLoading} />
            {hasError ? (
                <Error />
            ) : (
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
                                Products
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
                                        <Inventory2 /> Product List
                                    </h5>

                                    <div className="d-flex justify-content-end button-group mb-4">
                                        <HeaderTableButton
                                            isUpdated={isUpdated}
                                            addButton="#productModal"
                                            typeAddButton="product"
                                            setIsNew={setIsNew}
                                            download={downloadproductsData}
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
                                            type="product"
                                            targetModal="#productModal"
                                            handleEditClick={handleEditClick}
                                            sortModel={sortModel}
                                            setSortModel={setSortModel}
                                        />
                                        {/* <DataGrid
                                        columns={columns}
                                        rows={rows}
                                        paginationModel={paginationModel}
                                        onPaginationModelChange={
                                            setPaginationModel
                                        }
                                        paginationMode="server"
                                        rowCount={rowCount}
                                        loading={isLoading}
                                    /> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ProductForm
                user={props.auth.user.username}
                id={rowId}
                isNew={isNew}
                product={product}
                fetchProductsData={fetchProductsData}
            />
        </>
    );
};

export default Product;

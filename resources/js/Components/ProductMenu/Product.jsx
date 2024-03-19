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
    const columns = [
        { field: "no", headerName: "No", width: 70 },
        { field: "sku", headerName: "SKU", width: 150, editable: true },
        {
            field: "name",
            headerName: "Product Name",
            width: 150,
            editable: true,
        },
        {
            field: "price",
            headerName: "Price",
            width: 100,
            editable: true,
        },
        {
            field: "cost",
            headerName: "Cost of Good Sold",
            width: 150,
            editable: true,
        },
        { field: "stock", headerName: "Stock", width: 80, editable: true },
        {
            field: "status",
            headerName: "Status",
            width: 150,
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
            editable: true,
            renderCell: (params) => (
                <img src={params.value} className="h-100 w-50" />
            ),
        },
    ];

    useEffect(() => {
        fetchProductsData();
    }, [props.ziggy.location, paginationModel, search]);

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
                },
            });
            setRows(response.data.data);
            setRowCount(response.data.total);
            setIsLoading(false);
        } catch (error) {}
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
    const handleDeleteClick = async() => {
        setShowLoading(true);
        await deleteProduct();
        setShowLoading(false);

    }
    console.log("data", rows);
    console.log("isNew", isNew);
    console.log("product", product);

    return (
        <>
         <ConfirmModal
                id="deleteModal"
                type="delete"
                text="Are you sure want to delete?"
                handleClick={() => handleDeleteClick()}
            />
            <Loading isLoading={showLoading}/>
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
                            Products
                        </Typography>
                    </Breadcrumbs>
                </div>

                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-12">
                        <div className="card" style={{ width: "100%" }}>
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
                                        type="product"
                                        targetModal="#productModal"
                                        handleEditClick={handleEditClick}
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

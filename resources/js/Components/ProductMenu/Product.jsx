import { Inventory2 } from "@mui/icons-material";
import { Breadcrumbs, Chip, Link, TextField, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Datatable from "../Datatable";
import HeaderTableButton from "../HeaderTableButton";
import AddProductForm from "./AddProductForm";

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
            width: 150,
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

    console.log("data", rows);

    return (
        <>
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
                <img src='public/storage/images/70d1ce90b1d51bfdd8f56d4315be088b.png' alt='Gambar'/>
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
                                        typeAddButton="Add Product"
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
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddProductForm user={props.auth.user.username} />
        </>
    );
};

export default Product;

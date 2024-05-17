import { MenuProps } from "@/Config/SelectProps";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Close, SwapHoriz } from "@mui/icons-material";
import {
    Breadcrumbs,
    Button,
    FormControl,
    InputLabel,
    Link,
    MenuItem,
    OutlinedInput,
    Select,
    Typography,
} from "@mui/material";
import axios from "axios";
import FileSaver from "file-saver";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import ConfirmModal from "../ConfirmModal";
import Datatable from "../Datatable";
import HeaderTableButton from "../HeaderTableButton";
import Loading from "../Loading";
import AddProductForm from "./AddProductForm";
import OrderTabs from "./OrderTabs";

const OrderDetail = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [isChangeCustomer, setIsChangeCustomer] = useState(false);
    const customerData = props.data.original.header_transaction.customer;
    const [customerId, setCustomerId] = useState(null);
    const [customer, setCustomer] = useState({});
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const [productData, setProductData] = useState([]);
    const [productId, setproductId] = useState(0);
    const [isNew, setIsNew] = useState(true);
    const [orderDetail, setOrderDetail] = useState({});

    const isStatusValid =
        props.data.original.status.toLowerCase() !== "on delivery" &&
        props.data.original.status.toLowerCase() !== "completed";
    const columns = [
        { field: "no", headerName: "No", width: 70 },
        {
            field: "productName",
            headerName: "Product Name",
            width: 200,
        },
        {
            field: "size",
            headerName: "Size",
            width: 120,
        },
        {
            field: "price",
            headerName: "Price",
            width: 150,
        },
        {
            field: "quantity",
            headerName: "Quantity",
            width: 130,
        },
        {
            field: "notes",
            headerName: "Notes",
            width: 150,
        },
        {
            field: "imageUrl",
            headerName: "Image",
            width: 150,
            renderCell: (params) => (
                <img src={params.value} className="h-100 w-50" />
            ),
        },
    ];

    useEffect(() => {
        getOrderdProduct();
        setCustomer(customerData);
        getAllProducts();
    }, [props.ziggy.location]);

    const getOrderdProduct = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                "/order/$1/products".replace("$1", props.data.original.id)
            );
            setProducts(response.data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };
    const getAllCustomers = async () => {
        try {
            const params = {
                headerId: props.data.original,
            };
            const response = await axios.get("/customers/data");
            setCustomers(response.data);
        } catch (error) {}
    };
    const handleChangeCustomerClick = () => {
        setIsChangeCustomer(!isChangeCustomer);
        if (customers.length === 0) {
            getAllCustomers();
        }
    };

    const getAllProducts = async () => {
        try {
            const response = await axios.get("/products/data");
            setProductData(response.data);
        } catch (error) {}
    };
    const handleChangeCustomer = async () => {
        try {
            const params = {
                headerId: props.data.original.header_transaction.id,
                customerId: customerId,
            };
            setShowLoading(true);
            const response = await axios.put("/order/update/customer", params);
            Swal.fire({
                icon: "success",
                title: response.data.message,
                timer: 1500,
            }).then(() => {
                location.reload();
            });
            setShowLoading(false);
        } catch (error) {
            Swal.fire({
                title: "Oops",
                text: error.response.data,
                icon: "error",
                timer: 1500,
            });
            setShowLoading(false);
        }
    };
    const handleAddProductClick = () => {
        if (productData.length === 0) {
            getAllProducts();
        }
        setIsNew(true);
    };
    const handleDeleteOrderProduct = async () => {
        try {
            setShowLoading(true);
            const response = await axios.delete(
                "/order/delete/product/" + productId
            );
            Swal.fire({
                icon: "success",
                title: response.data.message,
                timer: 1500,
            }).then(() => {
                location.reload();
            });
            setShowLoading(false);
            getOrderdProduct();
        } catch (error) {
            Swal.fire({
                title: "Oops",
                text: error.response.data,
                icon: "error",
                timer: 1500,
            });
            setShowLoading(false);
        }
    };
    const handleEditClick = (id) => {
        setIsNew(false);
        getOrderDetail(id);
    };

    const getOrderDetail = (id) => {
        setOrderDetail(products.find((product) => product.id === id));
    };
    const sendInvoice = async () => {
        try {
            setShowLoading(true);
            const response = await axios.get(
                "/order/invoice/$1/send".replace(
                    "$1",
                    props.data.original.header_transaction.id
                )
            );
            setShowLoading(false);
            Swal.fire({
                icon: "success",
                title: response.data.message,
                timer: 1500,
            });
        } catch (error) {
            Swal.fire({
                title: "Oops",
                text: error.response.data,
                icon: "error",
                timer: 1500,
            });
            setShowLoading(false);
        }
    };
    const downloadInvoice = async () => {
        try {
            const response = await axios.get(
                "/order/invoice/$1/download".replace(
                    "$1",
                    props.data.original.header_transaction.id
                ),
                { responseType: "blob" }
            );

            const blob = new Blob([response.data], { type: "application/pdf" });

            FileSaver.saveAs(
                blob,
                "invoice_" + props.data.original.order_number + ".pdf"
            );
        } catch (error) {}
    };
    console.log(props);
    console.log(customers);
    console.log(isUpdated);
    console.log(products);
    console.log(orderDetail);

    // console.log(products)
    return (
        <div>
            <Loading isLoading={showLoading} />
            <div className="container">
                <div className="mb-5">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="none"
                            color="#243ab0"
                            href={route("dashboard")}
                        >
                            Home
                        </Link>
                        <Link
                            color="#243ab0"
                            underline="none"
                            href={route("orders")}
                        >
                            Order List
                        </Link>
                        <Typography color="#243ab0" sx={{ fontWeight: "600" }}>
                            Order Detail
                        </Typography>
                    </Breadcrumbs>
                </div>
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-8">
                        <div
                            className="card shadow-sm"
                            style={{ width: "100%", minHeight: "360px" }}
                        >
                            <div className="card-body">
                                <div className="">
                                    <OrderTabs
                                        data={props.data.original}
                                        customerAddress={customer.address}
                                        user={props.auth.user.username}
                                        isStatusValid={isStatusValid}
                                        sendInvoice={sendInvoice}
                                        downloadInvoice={downloadInvoice}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div
                            className="card shadow-sm"
                            style={{ width: "100%", minHeight: "360px" }}
                        >
                            <div className="card-body">
                                <h5 className="card-title">Customer Detail</h5>
                                <div className="d-flex justify-content-end mb-4">
                                    {isStatusValid && (
                                        <Button
                                            variant="contained"
                                            color={
                                                !isChangeCustomer
                                                    ? "primary"
                                                    : "error"
                                            }
                                            onClick={() =>
                                                handleChangeCustomerClick()
                                            }
                                        >
                                            {!isChangeCustomer ? (
                                                <>
                                                    <SwapHoriz /> Change
                                                </>
                                            ) : (
                                                <>
                                                    <Close /> Cancel
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                                {/* Update Customer Form */}

                                {isChangeCustomer ? (
                                    <>
                                        <div className="row">
                                            <div className="col-lg-12 mt-4">
                                                <FormControl
                                                    sx={{ m: 1, width: 300 }}
                                                >
                                                    <InputLabel id="demo-multiple-name-label">
                                                        <span>
                                                            Customer Name
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </span>
                                                    </InputLabel>
                                                    <Select
                                                        labelId="demo-multiple-name-label"
                                                        id="demo-multiple-name"
                                                        value={customerId}
                                                        onChange={(e) =>
                                                            setCustomerId(
                                                                e.target.value
                                                            )
                                                        }
                                                        input={
                                                            <OutlinedInput label="Customer Name*" />
                                                        }
                                                        MenuProps={MenuProps}
                                                    >
                                                        {customers.map(
                                                            (customer) => (
                                                                <MenuItem
                                                                    key={
                                                                        customer.id
                                                                    }
                                                                    value={
                                                                        customer.id
                                                                    }
                                                                >
                                                                    {
                                                                        customer.name
                                                                    }
                                                                </MenuItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="d-flex justify-content-end">
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    sx={{ marginTop: "28%" }}
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#saveModal"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faFloppyDisk}
                                                        className="mr-1"
                                                    />
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </div>
                                        {/* End of form */}
                                    </>
                                ) : (
                                    <>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <h4 className="detail-title">
                                                    Name
                                                </h4>
                                                <h4 className="detail-text">
                                                    {customer.name}
                                                </h4>
                                            </div>
                                            <div className="col-lg-6">
                                                <h4 className="detail-title">
                                                    Instagram
                                                </h4>
                                                <h4 className="detail-text">
                                                    {customer.instagram}
                                                </h4>
                                            </div>
                                        </div>
                                        <div className="row mt-4">
                                            <div className="col-lg-6">
                                                <h4 className="detail-title">
                                                    Phone
                                                </h4>
                                                <h4 className="detail-text">
                                                    {customer.phone_number}
                                                </h4>
                                            </div>
                                            <div className="col-lg-6">
                                                <h4 className="detail-title">
                                                    Email
                                                </h4>
                                                <h4 className="detail-text">
                                                    {customer.email}
                                                </h4>
                                            </div>
                                        </div>
                                        <div className="row mt-4">
                                            <div className="col-lg-12">
                                                <h4 className="detail-title">
                                                    Address
                                                </h4>
                                                <h4 className="detail-text">
                                                    {customer.address}
                                                </h4>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12 mt-4">
                        <div className="card shadow-sm" style={{ width: "100%" }}>
                            <div className="card-body">
                                <h5 className="card-title">Product Detail</h5>
                                <div className="d-flex justify-content-end button-group mb-4">
                                    {isStatusValid && (
                                        <HeaderTableButton
                                            isUpdated={isUpdated}
                                            addButton="#orderProductModal"
                                            typeAddButton="order"
                                            handleClick={handleAddProductClick}
                                        />
                                    )}
                                </div>
                                <div className="row">
                                    <Datatable
                                        rows={products}
                                        columns={columns}
                                        setRows={setProducts}
                                        setRowId={setproductId}
                                        isLoading={isLoading}
                                        setIsUpdated={setIsUpdated}
                                        isStatusValid={isStatusValid}
                                        type="orderProduct"
                                        targetModal="#orderProductModal"
                                        handleEditClick={handleEditClick}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmModal
                id="saveModal"
                type="submit"
                text="Are you sure want to change customer on this order?"
                handleClick={() => handleChangeCustomer()}
            />

            <ConfirmModal
                id="deleteModal"
                type="delete"
                text="Are you sure want to delete?"
                handleClick={() => handleDeleteOrderProduct()}
            />
            <AddProductForm
                products={productData}
                transactionId={props.data.original.id}
                isNew={isNew}
                orderNumber={props.data.original.order_number}
                orderDetail={orderDetail}
            />
        </div>
    );
};

export default OrderDetail;

import { MenuProps } from "@/Config/SelectProps";
import { Close, Delete } from "@mui/icons-material";
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import axios from "axios";
import dayjs from "dayjs";
import React from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import ConfirmModal from "../ConfirmModal";
import Loading from "../Loading";

const OrderForm = (props) => {
    const [products, setProducts] = useState([
        { productId: "", size: "", color: "", notes: "" },
    ]);
    const [orderDate, setOrderDate] = useState(null);
    const [customerId, setCustomerId] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const addProductField = () => {
        const product = {
            productId: "",
            size: "",
            color: "",
            notes: "",
            quantity: "",
        };
        const data = [...products];
        data.push(product);
        setProducts(data);
    };
    const removeProductField = (index) => {
        const data = [...products];
        data.splice(index, 1);
        setProducts(data);
    };
    const handleProductChange = (e, index) => {
        const data = [...products];
        data[index][e.target.name] = e.target.value;
        setProducts(data);
    };
    const createNewOrder = async () => {
        try {
            const params = {
                customerId: customerId,
                orderDate: orderDate,
                products: products,
                user: props.user,
            };
            setIsLoading(true);
            const response = await axios.post("/order", params);
            Swal.fire({
                icon: "success",
                title: response.data.message,
                timer: 1500,
            });
            setIsLoading(false);
            props.fetchOrdersData();
            resetFields();

        } catch (error) {
            setIsLoading(false);
            Swal.fire({
                title: "Oops",
                text: error.response.data,
                icon: "error",
                timer: 1500,
            });
        }
    };
    const resetFields = () => {
        setProducts([
            { productId: "", size: "", color: "", notes: "" },
        ]);
        setOrderDate(null);
        setCustomerId(0);
    }


    return (
        <>
            <Loading isLoading={isLoading} />
            <div
                class="modal fade"
                id="orderModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
            >
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                                Add Order
                            </h5>
                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <Close />
                            </button>
                        </div>
                        <div class="modal-body">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group">
                                    <div className="row">
                                        <div className="col col-lg-6">
                                            <DemoContainer
                                                components={["DatePicker"]}
                                            >
                                                <DatePicker
                                                    label={
                                                        <span>
                                                            Order Date
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </span>
                                                    }
                                                    // variant="outlined"
                                                    className="w-100 mb-4"
                                                    value={orderDate}
                                                    disableFuture
                                                    onChange={(date) =>
                                                        setOrderDate(
                                                            dayjs(date).format(
                                                                "YYYY-MM-DD"
                                                            )
                                                        )
                                                    }
                                                />
                                            </DemoContainer>
                                        </div>
                                        <div className="col col-lg-6">
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
                                                    // multiple
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
                                                    {props.customers.map(
                                                        (customer) => (
                                                            <MenuItem
                                                                key={
                                                                    customer.id
                                                                }
                                                                value={
                                                                    customer.id
                                                                }
                                                            >
                                                                {customer.name}
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-3">
                                            <Button
                                                onClick={() =>
                                                    addProductField()
                                                }
                                            >
                                                Add Product
                                            </Button>
                                        </div>
                                    </div>
                                    {products.map((form, index) => {
                                        return (
                                            <div
                                                className="row mb-2"
                                                key={index}
                                            >
                                                <div className="col col-lg-3">
                                                    <FormControl
                                                        sx={{
                                                            width: "100%",
                                                        }}
                                                    >
                                                        <InputLabel id="demo-multiple-name-label">
                                                            <span>
                                                                Product
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </span>
                                                        </InputLabel>
                                                        <Select
                                                            labelId="demo-multiple-name-label"
                                                            id="demo-multiple-name"
                                                            // multiple
                                                            name="productId"
                                                            value={
                                                                form.productId
                                                            }
                                                            onChange={(e) =>
                                                                handleProductChange(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            input={
                                                                <OutlinedInput label="Product*" />
                                                            }
                                                            MenuProps={
                                                                MenuProps
                                                            }
                                                        >
                                                            {props.products.map(
                                                                (product) => (
                                                                    <MenuItem
                                                                        key={
                                                                            product.id
                                                                        }
                                                                        value={
                                                                            product.id
                                                                        }
                                                                    >
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className="col col-lg-2">
                                                    <TextField
                                                        id="outlined-basic"
                                                        label={
                                                            <span>
                                                                Color
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </span>
                                                        }
                                                        variant="outlined"
                                                        className="w-100"
                                                        value={form.color}
                                                        name="color"
                                                        onChange={(e) =>
                                                            handleProductChange(
                                                                e,
                                                                index
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="col col-lg-2">
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Notes"
                                                        variant="outlined"
                                                        className="w-100"
                                                        multiline
                                                        value={form.notes}
                                                        name="notes"
                                                        onChange={(e) =>
                                                            handleProductChange(
                                                                e,
                                                                index
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="col col-lg-2">
                                                    <TextField
                                                        id="outlined-basic"
                                                        label={
                                                            <span>
                                                                Quantity
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </span>
                                                        }
                                                        variant="outlined"
                                                        className="w-100"
                                                        type="number"
                                                        value={form.quantity}
                                                        name="quantity"
                                                        onChange={(e) =>
                                                            handleProductChange(
                                                                e,
                                                                index
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="col col-lg-2">
                                                    <TextField
                                                        id="outlined-basic"
                                                        label={
                                                            <span>
                                                                Size
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </span>
                                                        }
                                                        variant="outlined"
                                                        className="w-100"
                                                        value={form.size}
                                                        name="size"
                                                        onChange={(e) =>
                                                            handleProductChange(
                                                                e,
                                                                index
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="col col-lg-1">
                                                    <Button
                                                        sx={{
                                                            marginLeft: "-20px",
                                                            marginTop: "10px",
                                                        }}
                                                        color="error"
                                                        onClick={() =>
                                                            removeProductField(
                                                                index
                                                            )
                                                        }
                                                        disabled={
                                                            products.length ===
                                                            1
                                                        }
                                                    >
                                                        <Delete />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <Button
                                variant="contained"
                                color="error"
                                data-bs-dismiss="modal"
                                sx={{ marginRight: "10px" }}
                                onClick={() => resetFields()}
                            >
                                Discard
                            </Button>
                            <Button
                                variant="contained"
                                data-bs-toggle="modal"
                                data-bs-target="#saveModal"
                                data-bs-dismiss="modal"
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmModal
                id="saveModal"
                type="submit"
                text="Are you sure want to save?"
                handleClick={() => createNewOrder()}
            />
        </>
    );
};

export default OrderForm;

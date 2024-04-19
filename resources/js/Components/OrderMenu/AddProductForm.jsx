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
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import ConfirmModal from "../ConfirmModal";
import Loading from "../Loading";

const AddProductForm = (props) => {
    const initialState = props.isNew
        ? { productId: "", size: "", color: "", notes: "", quantity:null }
        : {
              productId: props.orderDetail.productId,
              size: props.orderDetail.size,
              color: props.orderDetail.color,
              notes: props.orderDetail.notes,
              quantity : props.orderDetail.quantity
          };

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setProducts([initialState]);
    }, [props.isNew, props.orderDetail]);
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
    const addOrderProduct = async () => {
        try {
            const params = {
                transactionId: props.transactionId,
                products: products,
            };
            setIsLoading(true);
            const response = await axios.post("/order/add/product", params);
            Swal.fire({
                icon: "success",
                title: response.data.message,
                timer: 1500,
            }).then(() => {
                location.reload();
            });
            setIsLoading(false);
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
    const updateOrderProduct = async () => {
        const [product] = products;
        const params = {
            ...product,
            detailId: props.orderDetail.id,
        };
        try {
            setIsLoading(true);
            const response = await axios.put("/order/update/product", params);
            Swal.fire({
                icon: "success",
                title: response.data.message,
                timer: 1500,
            }).then(() => {
                location.reload();
            });
            setIsLoading(false);
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
    console.log(props.orderDetail);
    console.log(products);
    return (
        <div>
            <Loading isLoading={isLoading} />
            <div
                class="modal fade"
                id="orderProductModal"
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
                                {props.isNew
                                    ? "Add Product"
                                    : "Update Product " + props.orderNumber}
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
                                        <div className="col-lg-3">
                                            {props.isNew && (
                                                <Button
                                                    onClick={() =>
                                                        addProductField()
                                                    }
                                                >Add Product</Button>
                                            )}
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
                                                {props.isNew && (
                                                    <div className="col col-lg-1">
                                                        <Button
                                                            sx={{
                                                                marginLeft:
                                                                    "-20px",
                                                                marginTop:
                                                                    "10px",
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
                                                )}
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
                                data-bs-target="#addProductModal"
                                data-bs-dismiss="modal"
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmModal
                id="addProductModal"
                type="submit"
                text="Are you sure want to save?"
                handleClick={
                    props.isNew
                        ? () => addOrderProduct()
                        : () => updateOrderProduct()
                }
            />
        </div>
    );
};

export default AddProductForm;

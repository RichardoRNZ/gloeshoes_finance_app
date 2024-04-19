import { Close } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import ConfirmModal from "../ConfirmModal";
import Loading from "../Loading";

const AddProductForm = (props) => {
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({});

    const initialState = props.isNew
        ? { name: "", sku: "", stock: "", price: "", cost: "" }
        : {
              name: props.product.name,
              sku: props.product.sku,
              stock: props.product.stock,
              price: props.product.price,
              cost: props.product.cost,
          };
    useEffect(() => {
        setFormData(initialState);
        setImage(null);
    }, [props.isNew, props.product]);

    const handleFileChange = (newFile) => {
        setImage(newFile);
    };

    const saveProduct = async () => {
        try {
            const params = {
                ...formData,
                image: image,
                createdBy: props.user,
            };
            setIsLoading(true);
            const response = await axios.post("/product", params, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire({
                icon: "success",
                title: response.data.message,
                timer: 1500,
            });
            setFormData(initialState);
            setImage(null);
            setIsLoading(false);
            props.fetchProductsData();
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
    const updateProduct = async () => {
        try {
            const params = {
                ...formData,
                image: image,
                updatedBy: props.user,
                id: props.product.id,
            };
            setIsLoading(true);
            const response = await axios.post("/product/update", params, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire({
                icon: "success",
                title: response.data.message,
                timer: 1500,
            });
            setIsLoading(false);
            props.fetchProductsData();
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
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <>
            <Loading isLoading={isLoading} />
            <div
                class="modal fade"
                id="productModal"
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
                                {props.isNew ? "Add Product" : "Update Product"}
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
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                enctype="multipart/form-data"
                            >
                                <div className="form-group">
                                    <div className="row">
                                        <div className="col col-lg-4 col-md-4 col-sm-2">
                                            <TextField
                                                label={
                                                    <span>
                                                        SKU
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                    </span>
                                                }
                                                variant="outlined"
                                                className="w-100 mb-4"
                                                value={formData.sku}
                                                name="sku"
                                                InputLabelProps={props.isNew?{ shrink: true }:""}
                                                onChange={(e) =>
                                                    handleChange(e)
                                                }
                                            />
                                        </div>
                                        <div className="col col-lg-4 col-md-4 col-sm-2">
                                            <TextField
                                                id="outlined-basic"
                                                label={
                                                    <span>
                                                        Product Name
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                    </span>
                                                }
                                                variant="outlined"
                                                className="w-100"
                                                value={formData.name}
                                                InputLabelProps={{ shrink: true }}
                                                name="name"
                                                onChange={(e) =>
                                                    handleChange(e)
                                                }
                                            />
                                        </div>
                                        <div className="col col-lg-4 col-md-4 col-sm-2">
                                            <TextField
                                                id="outlined-basic"
                                                label={
                                                    <span>
                                                        Stock
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                    </span>
                                                }
                                                variant="outlined"
                                                className="w-100 mb-4"
                                                type="number"
                                                value={formData.stock}
                                                InputLabelProps={{ shrink: true }}
                                                name="stock"
                                                onChange={(e) =>
                                                    handleChange(e)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col col-lg-6 col-md-4 col-sm-2">
                                            <TextField
                                                id="outlined-basic"
                                                type="number"
                                                label={
                                                    <span>
                                                        Cost of Good Stock
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                    </span>
                                                }
                                                variant="outlined"
                                                className="w-100"
                                                value={formData.cost}
                                                InputLabelProps={{ shrink: true }}
                                                name="cost"
                                                onChange={(e) =>
                                                    handleChange(e)
                                                }
                                            />
                                        </div>
                                        <div className="col col-lg-6 col-md-4 col-sm-2">
                                            <TextField
                                                id="outlined-basic"
                                                label={
                                                    <span>
                                                        Price
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                    </span>
                                                }
                                                variant="outlined"
                                                className="w-100"
                                                InputLabelProps={{ shrink: true }}
                                                type="number"
                                                value={formData.price}
                                                name="price"
                                                onChange={(e) =>
                                                    handleChange(e)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col col-lg-12 mt-4">
                                            <MuiFileInput
                                                className="w-100"
                                                InputLabelProps={{ shrink: true }}
                                                label={
                                                    <span>
                                                        Image
                                                        {props.isNew ? (
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </span>
                                                }
                                                value={image}
                                                onChange={(newfile) =>
                                                    handleFileChange(newfile)
                                                }
                                                name="image"
                                            />
                                            {!props.isNew && (
                                                <img
                                                    src={
                                                        "/storage/images/" +
                                                        props.product.image
                                                    }
                                                    className="mt-3"
                                                    style={{ maxHeight: "25%" }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <Button
                                variant="contained"
                                color="error"
                                data-bs-dismiss="modal"
                                sx={{ marginRight: "10px" }}
                                onClick={() => setFormData(initialState)}
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
                handleClick={
                    props.isNew ? () => saveProduct() : () => updateProduct()
                }
            />
        </>
    );
};

export default AddProductForm;

import { Close } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import React from "react";
import { useState } from "react";
import Swal from "sweetalert2";

const AddProductForm = (props) => {
    const [name, setName] = useState("");
    const [sku, setSku] = useState("");
    const [stock, setStock] = useState(null);
    const [price, setPrice] = useState(null);
    const [cost, setCost] = useState(null);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (newFile) => {
        setImage(newFile);
    };
    const saveProduct = async (product) => {
        try {
            const params = {
                name: name,
                sku: sku,
                stock: stock,
                price: price,
                cost: cost,
                image: image,
                createdBy: props.user,

            };
            console.log(image);
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
        } catch (error) {
            Swal.fire({
                title: "Oops",
                text: error.response.data,
                icon: "error",
                timer: 1500,
            });
        }
    };

    return (
        <>
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
                                Add Product
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
                                                value={sku}
                                                onChange={(e) =>
                                                    setSku(e.target.value)
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
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
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
                                                value={stock}
                                                onChange={(e) =>
                                                    setStock(e.target.value)
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
                                                value={cost}
                                                onChange={(e) =>
                                                    setCost(e.target.value)
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
                                                type="number"
                                                value={price}
                                                onChange={(e) =>
                                                    setPrice(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col col-lg-12 mt-4">
                                            <MuiFileInput
                                                className="w-100"
                                                label={
                                                    <span>
                                                        Image
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                    </span>
                                                }
                                                value={image}
                                                onChange={handleFileChange}
                                            />
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
                                // onClick={() => resetField()}
                            >
                                Discard
                            </Button>
                            <Button
                                variant="contained"
                                // data-bs-toggle="modal"
                                // data-bs-target="#saveModal"
                                data-bs-dismiss="modal"
                                onClick={() => saveProduct()}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddProductForm;

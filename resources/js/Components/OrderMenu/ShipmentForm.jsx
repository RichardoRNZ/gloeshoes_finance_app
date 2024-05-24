import { Close } from "@mui/icons-material";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import ConfirmModal from "../ConfirmModal";
import Loading from "../Loading";

const ShipmentForm = (props) => {
    const [isSameAddress, setIsSameAddress] = useState(true);
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const initialState = props.isNewShipment
        ? {
              name: "",
              receiptNumber: "",
              price: null,
              address: props.customerAddress,
          }
        : {
              name: props.shipmentData?.name,
              receiptNumber: props.shipmentData?.receipt_number,
              price: props.shipmentData?.price,
              address: props.shipmentData?.shipping_address,
          };
    useEffect(() => {
        setFormData(initialState);
    }, [props.isNewShipment]);
    useEffect(() => {
        setFormData((prevData) => ({
           ...prevData,
            address: isSameAddress? props.customerAddress : "",
        }));
    }, [isSameAddress]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const createNewShipment = async () => {
        try {
            const params = {
                ...formData,
                transactionId: props.transactionId,
                createdBy: props.user,
            };

            setIsLoading(true);
            const response = await axios.post("/order/shipping", params);
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
    const updateShipment = async () => {
        try {
            const params = {
                ...formData,
                id: props.shipmentData.id,
                updatedBy: props.user,
            };

            setIsLoading(true);
            const response = await axios.put("/order/shipping/update", params);
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
    const resetFields = () => {
        setFormData(initialState);
        setIsSameAddress(true);
    }

    return (
        <div>
            <Loading isLoading={isLoading} />
            <div
                class="modal fade"
                id="shipmentModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                                Add Shipment
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
                            <form>
                                <div className="form-group">
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <TextField
                                                label={
                                                    <span>
                                                        Shipment Name
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                    </span>
                                                }
                                                variant="outlined"
                                                className="w-100 mb-4"
                                                value={formData.name}
                                                name="name"
                                                onChange={(e) =>
                                                    handleChange(e)
                                                }
                                            />
                                        </div>
                                        <div className="col-lg-4">
                                            <TextField
                                                label={
                                                    <span>
                                                        Receipt Number
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                    </span>
                                                }
                                                variant="outlined"
                                                className="w-100 mb-4"
                                                value={formData.receiptNumber}
                                                name="receiptNumber"
                                                onChange={(e) =>
                                                    handleChange(e)
                                                }
                                            />
                                        </div>
                                        <div className="col-lg-4">
                                            <TextField
                                                label={
                                                    <span>
                                                        Price
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                    </span>
                                                }
                                                variant="outlined"
                                                className="w-100 mb-4"
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
                                        <div className="col-lg-12">
                                            {props.isNewShipment && (
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={
                                                                isSameAddress
                                                            }
                                                            onChange={(e) =>
                                                                setIsSameAddress(
                                                                    e.target
                                                                        .checked
                                                                )
                                                            }
                                                            name="gilad"
                                                        />
                                                    }
                                                    label="Same as customer address"
                                                />
                                            )}
                                            {(!isSameAddress ||
                                                !props.isNewShipment) && (
                                                <TextField
                                                    label={
                                                        <span>
                                                            Address
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </span>
                                                    }
                                                    variant="outlined"
                                                    className="w-100 mb-4"
                                                    multiline
                                                    value={formData.address}
                                                    name="address"
                                                    onChange={(e) =>
                                                        handleChange(e)
                                                    }
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
                handleClick={
                    props.isNewShipment
                        ? () => createNewShipment()
                        : () => updateShipment()
                }
            />
        </div>
    );
};

export default ShipmentForm;

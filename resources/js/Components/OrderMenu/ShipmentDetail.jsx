import { Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import ConfirmModal from "../ConfirmModal";
import Loading from "../Loading";
import ShipmentForm from "./ShipmentForm";

const ShipmentDetail = (props) => {
    const [isNewShipment, setIsNewShipment] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const deleteShipment = async () => {
        try {
            setIsLoading(true);
            const response = await axios.delete(
                "/order/shipping/delete/" + props.shipmentData.id
            );
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
    return (
        <div>
            <Loading isLoading={isLoading} />
            <div className="container">
                <div className="d-flex justify-content-end button-group">
                    {props.isStatusValid && (
                        <>
                            {props.shipmentData ? (
                                <>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteModal"
                                        sx={{ marginRight: "10px" }}
                                    >
                                        Delete Shipment
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        data-bs-toggle="modal"
                                        data-bs-target="#shipmentModal"
                                        onClick={() => setIsNewShipment(false)}
                                    >
                                        Update Shipment
                                    </Button>

                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        data-bs-toggle="modal"
                                        data-bs-target="#shipmentModal"
                                        onClick={() => setIsNewShipment(true)}
                                    >
                                        Add Shipment
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </div>
                <div className="row mt-4">
                    <div className="col-lg-4">
                        <h4 className="detail-title">Receipt Number</h4>
                        <h4 className="detail-text">
                            {props.shipmentData?.receipt_number ?? "-"}
                        </h4>
                    </div>
                    <div className="col-lg-4">
                        <h4 className="detail-title">Shipping Name</h4>
                        <h4 className="detail-text">
                            {props.shipmentData?.name ?? "-"}
                        </h4>
                    </div>
                    <div className="col-lg-4">
                        <h4 className="detail-title">Price</h4>
                        <h4 className="detail-text">
                            {props.shipmentData
                                ? "Rp. " + props.shipmentData.price
                                : "-"}
                        </h4>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-lg-12">
                        <h4 className="detail-title">Address</h4>
                        <h4 className="detail-text">
                            {props.shipmentData?.shipping_address ?? "-"}
                        </h4>
                    </div>
                </div>
            </div>
            <ShipmentForm isNewShipment={isNewShipment} {...props} />
            <ConfirmModal
                id="deleteModal"
                type="delete"
                text="Are you sure want to delete?"
                handleClick={() => deleteShipment()}
            />
        </div>
    );
};

export default ShipmentDetail;

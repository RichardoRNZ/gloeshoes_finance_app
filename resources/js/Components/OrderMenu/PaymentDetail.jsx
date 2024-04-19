import { Button } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import React from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import ConfirmModal from "../ConfirmModal";
import Datatable from "../Datatable";
import Loading from "../Loading";
import PaymentForm from "./PaymentForm";

const PaymentDetail = (props) => {
    const columns = [
        {
            field: "payment_date",
            headerName: "Payment Date",
            width: 120,
            valueFormatter: (params) =>
                dayjs(params?.value).format("DD MMMM YYYY"),
        },
        {
            field: "payment_amount",
            headerName: "Payment Amount",
            valueFormatter: (params) => "Rp. " + params.value,
            width: 150,
        },
        {
            field: "description",
            headerName: "Description",
            width: 180,
        },
        {
            field: "transfer_receipt",
            headerName: "Transfer Receipt",
            width: 150,
            renderCell: (params) => (
                <img
                    src={"/storage/images/" + params.value}
                    className="h-100 w-50"
                />
            ),
        },
    ];
    const [payments, setPayments] = useState(
        props.headerPayment.payments ?? []
    );
    const [isLoading, setIsLoading] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [rowId, setRowId] = useState(0);
    const [isUpdated, setIsUpdated] = useState(false);

    console.log(props);
    const deletePayment = async () => {
        try {
            setIsLoading(true);
            const response = await axios.delete(
                "/order/payment/delete/" + rowId
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
                    {props.headerPayment.payment_status.toLowerCase() ===
                        "not paid" && (
                        <Button
                            variant="contained"
                            color="primary"
                            data-bs-toggle="modal"
                            data-bs-target="#paymentModal"
                            // sx={{ marginRight: "10px" }}
                        >
                            Add Payment
                        </Button>
                    )}
                </div>
                <div className="row mt-4">
                    <Datatable
                        rows={payments}
                        columns={columns}
                        setRowId={setRowId}
                        setIsUpdated={setIsUpdated}
                        isStatusValid={props.status!=="completed"}
                        type="payment"
                    />
                </div>
            </div>
            <PaymentForm {...props} />
            <ConfirmModal
                id="deleteModal"
                type="delete"
                text="Are you sure want to delete this payment?"
                handleClick={() => deletePayment()}
            />
        </div>
    );
};

export default PaymentDetail;

import { Close } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import axios from "axios";
import dayjs from "dayjs";
import { MuiFileInput } from "mui-file-input";
import React from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import ConfirmModal from "../ConfirmModal";
import Loading from "../Loading";

const PaymentForm = (props) => {
    const initialState = {
        paymentAmount: "",
        description: "",
    };
    const [formData, setFormData] = useState(initialState);
    const [transferReceipt, setTrasferReceipt] = useState(null);
    const [paymentDate, setPaymentDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const createNewPayment = async () => {
        const params = {
            ...formData,
            transferReceipt: transferReceipt,
            paymentDate: paymentDate,
            headerId: props.headerId,
            createdBy: props.user,
        };
        try {
            setIsLoading(true);
            const response = await axios.post("/order/payment", params, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
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
        setTrasferReceipt(null);
        setPaymentDate(null);
    };
    console.log(formData);
    console.log(paymentDate);

    return (
        <>
            <Loading isLoading={isLoading} />
            <div
                class="modal fade"
                id="paymentModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                                Add Payment
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
                                        <div className="col-lg-6">
                                            <TextField
                                                label={
                                                    <span>
                                                        Payment Amount
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                    </span>
                                                }
                                                variant="outlined"
                                                type="number"
                                                className="w-100 mb-3"
                                                value={formData.paymentAmount}
                                                name="paymentAmount"
                                                onChange={(e) =>
                                                    handleChange(e)
                                                }
                                            />
                                        </div>
                                        <div className="col-lg-6">
                                            <MuiFileInput
                                                className="w-100"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                label={
                                                    <span>
                                                        Image
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                    </span>
                                                }
                                                value={transferReceipt}
                                                onChange={(newfile) =>
                                                    setTrasferReceipt(newfile)
                                                }
                                                name="image"
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <DemoContainer
                                                components={["DatePicker"]}
                                            >
                                                <DatePicker
                                                    label={
                                                        <span>
                                                            Payment Date
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </span>
                                                    }
                                                    variant="outlined"
                                                    className="w-100 mb-4"
                                                    name="paymentDate"
                                                    value={paymentDate}
                                                    disableFuture
                                                    onChange={(date) =>
                                                        setPaymentDate(
                                                            dayjs(date).format(
                                                                "YYYY-MM-DD"
                                                            )
                                                        )
                                                    }
                                                />
                                            </DemoContainer>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-12">
                                            <TextField
                                                label={
                                                    <span>
                                                        Description
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                    </span>
                                                }
                                                variant="outlined"
                                                className="w-100 mb-4"
                                                multiline
                                                value={formData.description}
                                                name="description"
                                                onChange={(e) =>
                                                    handleChange(e)
                                                }
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
                handleClick={() => createNewPayment()}
            />
        </>
    );
};

export default PaymentForm;

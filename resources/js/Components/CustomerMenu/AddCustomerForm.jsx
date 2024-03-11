import { Close } from "@mui/icons-material";
import { Button, InputAdornment, TextField } from "@mui/material";
import { grey } from "@mui/material/colors";
import axios from "axios";

import React, { useState } from "react";
import Swal from "sweetalert2";
import ConfirmModal from "../ConfirmModal";
import Loading from "../Loading";

const AddCustomerForm = (props) => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [instagramAccount, setInstagramAccount] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const resetField = () => {
        setName("");
        setAddress("");
        setEmail("");
        setPhoneNumber("");
        setInstagramAccount("");
    };

    const saveCustomer = async () => {
        try {
            const params = {
                name: name,
                email: email,
                address: address,
                phoneNumber: phoneNumber,
                instagram: instagramAccount,
                createdBy: props.user,
            };
            const response = await axios.post("/customers", params);
            resetField();
            Swal.fire({
                icon: "success",
                title: response.data.message,
                timer: 1500,
            });
            props.getCustomer();
        } catch (error) {
            Swal.fire({
                title: "Oops",
                text: error.response.data,
                icon: "error",
                timer: 1500,
            });
        }
    };
    const handleSubmit = async () => {
        setIsLoading(true);
        await saveCustomer();
        setIsLoading(false);
    };

    return (
        <>
            <Loading isLoading={isLoading} />
            <div
                class="modal fade"
                id="customerModal"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                                Add Customer
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
                            <div className="form-group">
                                <div className="row">
                                    <div className="col col-lg-6 col-md-4 col-sm-2">
                                        <TextField
                                            id="outlined-basic"
                                            label={
                                                <span>
                                                    Customer Name
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </span>
                                            }
                                            variant="outlined"
                                            className="w-100 mb-4"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="col col-lg-6 col-md-4 col-sm-2">
                                        <TextField
                                            id="outlined-basic"
                                            label="Instagram Account"
                                            variant="outlined"
                                            className="w-100"
                                            value={instagramAccount}
                                            onChange={(e) =>
                                                setInstagramAccount(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col col-lg-6 col-md-4 col-sm-2">
                                        <TextField
                                            id="outlined-basic"
                                            label={
                                                <span>
                                                    Phone Number
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </span>
                                            }
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        +62
                                                    </InputAdornment>
                                                ),
                                            }}
                                            variant="outlined"
                                            className="w-100 mb-4"
                                            value={phoneNumber}
                                            onChange={(e) =>
                                                setPhoneNumber(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="col col-lg-6 col-md-4 col-sm-2">
                                        <TextField
                                            id="outlined-basic"
                                            label={
                                                <span>
                                                    Email
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </span>
                                            }
                                            variant="outlined"
                                            className="w-100"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col col-lg-12">
                                        <TextField
                                            id="outlined-textarea"
                                            label={
                                                <span>
                                                    Address
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </span>
                                            }
                                            className="w-100"
                                            multiline
                                            value={address}
                                            onChange={(e) =>
                                                setAddress(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            {/* <Button
                                variant="contained"
                                data-bs-dismiss="modal"
                                color="secondary"
                                sx={{ marginRight: "10px" }}
                            >
                                Cancel
                            </Button> */}
                            <Button
                                variant="contained"
                                color="error"
                                data-bs-dismiss="modal"
                                sx={{ marginRight: "10px" }}
                                onClick={() =>resetField()}
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
                handleClick={handleSubmit}
            />
        </>
    );
};

export default AddCustomerForm;

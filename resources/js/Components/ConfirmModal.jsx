import { Button } from "@mui/material";
import React from "react";

const ConfirmModal = (props) => {
    return (
        <div>
            <div
                class="modal fade"
                id={props.id}
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">
                                Confirmation
                            </h5>
                        </div>
                        <div class="modal-body">{props.text}</div>
                        <div class="modal-footer">
                            <Button
                                variant="contained"
                                color={
                                    props.type === "delete"
                                        ? "secondary"
                                        : "error"
                                }
                                data-bs-dismiss="modal"
                                sx={{ marginRight: "10px" }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color={
                                    props.type === "delete"
                                        ? "error"
                                        : "primary"
                                }
                                onClick={()=>props.handleClick()}
                                data-bs-dismiss="modal"
                            >
                                Yes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

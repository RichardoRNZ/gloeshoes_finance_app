import { Add, Delete, Download, Save } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";

const HeaderTableButton = (props) => {
    return (
        <>
            {props.isUpdated ? (
                <>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{ marginRight: "10px" }}
                        data-bs-toggle="modal"
                        data-bs-target="#discardModal"
                    >
                        <Delete />
                        Discard Update
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ marginRight: "10px" }}
                        data-bs-toggle="modal"
                        data-bs-target="#updateModal"
                    >
                        <Save />
                        Save Update
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ marginRight: "10px" }}
                    >
                        <Download />
                        Download
                    </Button>
                    <Button
                        variant="contained"
                        className="mr-4"
                        data-bs-toggle="modal"
                        data-bs-target={props.addButton}
                    >
                        <Add />
                        {props.typeAddButton}
                    </Button>
                </>
            )}
        </>
    );
};

export default HeaderTableButton;

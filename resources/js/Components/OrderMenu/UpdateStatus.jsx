import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
    stepConnectorClasses,
} from "@mui/material/StepConnector";
import { Create, Done, LocalShipping } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxesPacking } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import Loading from "../Loading";
import ConfirmModal from "../ConfirmModal";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
            theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
        borderRadius: 1,
    },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
    backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
        backgroundImage:
            "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
        backgroundImage:
            "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    }),
}));

function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const icons = {
        1: <Create />,
        2: <FontAwesomeIcon icon={faBoxesPacking} />,
        3: <LocalShipping />,
        4: <Done />,
    };

    return (
        <ColorlibStepIconRoot
            ownerState={{ completed, active }}
            className={className}
        >
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
}

ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
};

const status = ["CREATED", "ON PROGRESS", "ON DELIVERY", "COMPLETED"];

export default function UpdateStatus(props) {
    const [statusOrder, setStatusOrder] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const updateStatus = async () => {
        const params = { id: props.transactionId, status: statusOrder };
        try {
            setIsLoading(true);
            const response = await axios.put("/order/update/status", params);
            Swal.fire({
                icon: "success",
                title: "Sucecss update order status",
                timer: 1500,
            }).then(() => {
                location.reload();
            });
            setIsLoading(false);
            setStatusOrder("");
        } catch (error) {
            Swal.fire({
                title: "Oops",
                text: error.response.data,
                icon: "error",
                timer: 1500,
            });
            setIsLoading(false);
            setStatusOrder("");
        }
    };
    return (
        <>
            <Loading isLoading={isLoading} />
            <div className="container">
                <div className="d-flex justify-content-end button-group mt-2">
                    {props.status.toLowerCase() === "on progress" &&
                        props.shipmentData && (
                            <Button
                                variant="contained"
                                color="primary"
                                data-bs-toggle="modal"
                                data-bs-target="#submitModal"
                                onClick={() => setStatusOrder("ON DELIVERY")}
                            >
                                Deliver Product
                            </Button>
                        )}
                    {props.status.toLowerCase() === "on delivery" &&props.paymentStatus.toLowerCase()==="paid" && (
                        <Button
                            variant="contained"
                            color="success"
                            data-bs-toggle="modal"
                            data-bs-target="#submitModal"
                            onClick={() => setStatusOrder("COMPLETED")}
                        >
                            Complete Order
                        </Button>
                    )}
                </div>
                <Stack sx={{ width: "100%", marginTop: "8%" }} spacing={4}>
                    <Stepper
                        alternativeLabel
                        activeStep={status.indexOf(props.status)}
                        connector={<ColorlibConnector />}
                    >
                        {status.map((label) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={ColorlibStepIcon}>
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Stack>
            </div>
            <ConfirmModal
                id="submitModal"
                type="submit"
                text="Are you sure want to update this order status?"
                handleClick={() => updateStatus()}
            />
        </>
    );
}

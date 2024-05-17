import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button, Divider } from "@mui/material";
import PaymentDetail from "./PaymentDetail";
import dayjs from "dayjs";
import { data } from "autoprefixer";
import ShipmentDetail from "./ShipmentDetail";
import UpdateStatus from "./UpdateStatus";
import ConfirmModal from "../ConfirmModal";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function OrderTabs(props) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    console.log(props);

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <Tab label="Order Summary" {...a11yProps(0)} />
                    <Tab label="Invoice" {...a11yProps(1)} />
                    <Tab label="Payment Detail" {...a11yProps(2)} />
                    <Tab label="Shipping Detail" {...a11yProps(3)} />
                    <Tab label="Status" {...a11yProps(4)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <div className="row mt-4">
                    <div className="col-lg-4">
                        <h4 className="detail-title">Order ID</h4>
                        <h4 className="detail-text">
                            {props.data.order_number}
                        </h4>
                    </div>
                    <div className="col-lg-4">
                        <h4 className="detail-title">Order Date</h4>
                        <h4 className="detail-text">
                            {dayjs(props.date).format("DD MMMM YYYY")}
                        </h4>
                    </div>
                    <div className="col-lg-4">
                        <h4 className="detail-title">Order Status</h4>
                        <h4 className="detail-text">{props.data.status}</h4>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="row">
                        <div className="col-lg-4">
                            <h4 className="detail-title">Shipping</h4>
                            <h4 className="detail-text">
                                {props.data.shipment?.name ?? "-"}
                            </h4>
                        </div>
                        <div className="col-lg-4">
                            <h4 className="detail-title">Receipt Number</h4>
                            <h4 className="detail-text">
                                {props.data.shipment?.receipt_number ?? "-"}
                            </h4>
                        </div>
                        <div className="col-lg-4">
                            <h4 className="detail-title">Total Price</h4>
                            <h4 className="detail-text">
                                {"Rp. " +
                                    props.data.header_transaction.total_price}
                            </h4>
                        </div>
                    </div>
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <div className="d-flex justify-content-end button-group">
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ marginRight: "10px" }}
                        onClick={() => {
                            props.downloadInvoice();
                        }}
                    >
                        Print Invoice
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        data-bs-toggle="modal"
                        data-bs-target="#sendModal"
                    >
                        Send Invoice
                    </Button>
                </div>
                <div className="row mt-4">
                    <div className="col-lg-4">
                        <h4 className="detail-title">Total Price</h4>
                        <h4 className="detail-text">
                            {"Rp. " +
                                (props.data.header_transaction.total_price -
                                    (props.data.shipment?.price ?? 0))}
                        </h4>
                    </div>
                    <div className="col-lg-4">
                        <h4 className="detail-title">Shipping Price</h4>
                        <h4 className="detail-text">
                            {props.data.shipment?.price
                                ? "Rp. " + props.data.shipment?.price
                                : "-"}
                        </h4>
                    </div>
                    <div className="col-lg-4">
                        <h4 className="detail-title">Total Amount</h4>
                        <h4 className="detail-text">
                            {"Rp. " + props.data.header_transaction.total_price}
                        </h4>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="row">
                        <div className="col-lg-4">
                            <h4 className="detail-title">Payment Status</h4>
                            <h4 className="detail-text">
                                {
                                    props.data.header_transaction.header_payment
                                        .payment_status
                                }
                            </h4>
                        </div>
                        <div className="col-lg-4">
                            <h4 className="detail-title">Paid</h4>
                            <h4 className="detail-text">
                                {"Rp. " +
                                    (props.data.header_transaction.total_price -
                                        props.data.header_transaction
                                            .header_payment
                                            .payment_remaining_amount)}
                            </h4>
                        </div>
                        <div className="col-lg-4">
                            <h4 className="detail-title">Remaining</h4>
                            <h4 className="detail-text">
                                {"Rp. " +
                                    props.data.header_transaction.header_payment
                                        .payment_remaining_amount}
                            </h4>
                        </div>
                    </div>
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <PaymentDetail
                    headerPayment={props.data.header_transaction.header_payment}
                    user={props.user}
                    headerId={props.data.header_transaction.id}
                    status={props.data.status}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <ShipmentDetail
                    shipmentData={props.data.shipment ?? null}
                    customerAddress={props.customerAddress}
                    transactionId={props.data.id}
                    user={props.user}
                    isStatusValid={props.isStatusValid}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
                <UpdateStatus
                    status={props.data.status}
                    shipmentData={props.data.shipment}
                    transactionId={props.data.id}
                    paymentStatus={
                        props.data.header_transaction.header_payment
                            .payment_status
                    }
                />
            </CustomTabPanel>
            <ConfirmModal
                id="sendModal"
                type="submit"
                text="Are you sure want to send invoice of this order to the customer?"
                handleClick={() => props.sendInvoice()}
            />
        </Box>
    );
}

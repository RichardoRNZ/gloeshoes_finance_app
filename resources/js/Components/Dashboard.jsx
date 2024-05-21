import { generateRandomColors, options } from "@/Config/ChartConfig";
import {
    faBox,
    faChartSimple,
    faDollar,
    faDollarSign,
    faFileInvoice,
    faFileInvoiceDollar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Breadcrumbs, Chip, Link, Typography } from "@mui/material";

import dayjs from "dayjs";
import React from "react";
import { useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import Datatable from "./Datatable";
import Loading from "./Loading";

const Dashboard = (props) => {
    const [activerOrder, setActiveOrder] = useState(props.activeOrder);
    const thisMonth = dayjs(new Date()).format("MMMM");
    const dashboardSummary = [
        {
            icon: faBox,
            total: props.completeTransaction,
            title: "Complete Transaction in " + thisMonth,
            color: "warning",
        },
        {
            icon: faChartSimple,
            total: props.totalSellProduct,
            title: "Number of Sold Product in " + thisMonth,
            color: "primary",
        },
        {
            icon: faFileInvoiceDollar,
            total: props.notPaidTransaction,
            title: "Transaction Have Not Been Paid",
            color: "danger",
        },
        {
            icon: faDollar,
            total: props.totalRevenue,
            title: "Total Revenue in " + thisMonth,
            color: "success",
        },
    ];
    const columns = [
        {
            field: "orderNumber",
            headerName: "Order ID",
            width: 200,
        },
        {
            field: "customerName",
            headerName: "Customer Name",
            width: 180,
        },
        {
            field: "date",
            headerName: "Order Date",
            width: 140,
            valueFormatter: (params) =>
                dayjs(params?.value).format("DD MMMM YYYY"),
        },

        {
            field: "orderStatus",
            headerName: "Order Status",
            width: 140,
            renderCell: (params) => (
                <Chip
                    color={
                        params.value.toLowerCase() === "created"
                            ? "warning"
                            : params.value.toLowerCase() === "on progress"
                            ? "secondary"
                            : params.value.toLowerCase() === "on delivery"
                            ? "primary"
                            : "success"
                    }
                    label={params.value.toUpperCase()}
                />
            ),
        },
        {
            field: "paymentStatus",
            headerName: "Payment Status",
            width: 150,
            renderCell: (params) => (
                <Chip
                    color={
                        params.value.toLowerCase() === "not paid"
                            ? "error"
                            : params.value === "not yet paid off"
                            ? "secondary"
                            : "success"
                    }
                    label={params.value.toUpperCase()}
                />
            ),
        },
    ];
    const chartDataSet = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
        datasets: [
            {
                label: "Total Revenue in "+dayjs().format('MMMM'),
                fill: true,
                data: props.currentMonthRevenue.map((row) => row.total_amount),
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
            {
                label: "Total Revenue in "+dayjs().subtract(1,'month').format('MMMM'),
                fill: true,
                data: props.lastMonthRevenue.map((row) => row.total_amount),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
            },
        ],
    };
    const pieChartDataSet = {
        labels: props.soldProducts.map((row) => row.name),
        datasets: [
            {
                label: "Number of products sold",
                data: props.soldProducts.map((row) => row.total_sold),
                backgroundColor: generateRandomColors(
                    props.soldProducts.length
                ),
            },
        ],
    };


    return (
        <>
            <div className="container">
                <div className="mb-4">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography color="#243ab0" sx={{ fontWeight: "600" }}>
                            Dashboard
                        </Typography>
                    </Breadcrumbs>
                </div>
                <div className="row mt-4 dashboard-summary">
                    {dashboardSummary.map((item, index) => {
                        return (
                            <div className="col-lg-3">
                                <div
                                    className={
                                        "card shadow-sm bg-body rounded border-none border-bottom border-3 border-" +
                                        item.color
                                    }
                                    key={index}
                                >
                                    <div className="card-body d-flex flex-column justify-content-center ">
                                        <div className="card-icon">
                                            <FontAwesomeIcon
                                                icon={item.icon}
                                                className={"text-" + item.color}
                                            />
                                        </div>
                                        <p className="card-subtitle mb-2 text-wrap text-dark">
                                            {item.title}
                                        </p>
                                        <h5 className="card-title text-dark">
                                            {item.total}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="row mt-4">
                    <div className="col-lg-8">
                        <div
                            class="card shadow-sm w-100"
                            style={{ minHeight: "360px" }}
                        >
                            <div className="card-body">
                                <h5 class="card-title">{"Total Revenue in "+dayjs().format('MMMM')}</h5>
                                <div className="d-flex justify-content-end mb-4">
                                    <Link
                                        underline="none"
                                        color="#243ab0"
                                        href={route("reports")}
                                    >
                                        View All
                                    </Link>
                                </div>
                                <div
                                    className="chart-container"
                                    style={{
                                        position: "relative",
                                        height: "40vh",
                                        width: "55vw",
                                    }}
                                >
                                    <Line
                                        data={chartDataSet}
                                        options={options}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div
                            class="card w-100 shadow-sm"
                            style={{ minHeight: "360px" }}
                        >
                            <div class="card-body">
                                <h5 class="card-title">Sold Product</h5>
                                <div className="d-flex justify-content-end mb-4">
                                    <Link
                                        underline="none"
                                        color="#243ab0"
                                        href={route("reports")}
                                    >
                                        View All
                                    </Link>
                                </div>
                                <div
                                    className="chart-container"
                                    style={{
                                        position: "relative",
                                        height: "40vh",
                                        width: "25vw",
                                    }}
                                >
                                    <Pie
                                        data={pieChartDataSet}
                                        options={options}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-lg-12">
                        <div
                            class="card shadow-sm w-100"
                            style={{ minHeight: "360px" }}
                        >
                            <div class="card-body">
                                <h5 class="card-title">Active Order</h5>
                                <div className="d-flex justify-content-end mb-4">
                                    <Link
                                        underline="none"
                                        color="#243ab0"
                                        href={route("orders")}
                                    >
                                        View All
                                    </Link>
                                </div>
                                <div className="row">
                                    <Datatable
                                        rows={activerOrder}
                                        columns={columns}
                                        // setRowId={setRowId}
                                        // setIsUpdated={setIsUpdated}
                                        isStatusValid={false}
                                        type="dashboard"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;

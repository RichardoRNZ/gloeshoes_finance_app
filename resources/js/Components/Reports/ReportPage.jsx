import { centerTextPlugin, generateRandomColors, options } from "@/Config/ChartConfig";
import { MenuProps } from "@/Config/SelectProps";
import {
    ArrowDropDown,
    ArrowDropUp,
    Download,
    Search,
} from "@mui/icons-material";
import {
    Breadcrumbs,
    Button,
    FormControl,
    InputLabel,
    Link,
    MenuItem,
    OutlinedInput,
    Select,
    Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import axios from "axios";
import dayjs from "dayjs";
import FileSaver from "file-saver";
import React from "react";
import { useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import Swal from "sweetalert2";
import Loading from "../Loading";

const ReportPage = (props) => {
    const reportType = [
        "Monthly Revenue",
        "Annual Revenue",
        "Monthly Gross Profit",
        "Annual Gross Profit",
    ];
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [reportTypeValue, setReportTypeValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isValidDate, setIsValidDate] = useState(true);
    const [reportData, setReportData] = useState("");
    const [error, setError] = useState(null);
    const maxDate =
        reportTypeValue.split(" ")[0] === "Monthly"
            ? dayjs(fromDate).add(31, "day")
            : dayjs(fromDate).add(1, "year");
    const getReportData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                "/report/data?startDate=" +
                    fromDate +
                    "&endDate=" +
                    toDate +
                    "&type=" +
                    reportTypeValue
            );
            setReportData(response.data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            Swal.fire({
                title: "Oops",
                text: error.response.data,
                icon: "error",
                timer: 1500,
            });
        }
    };
    const errorMessage = React.useMemo(() => {
        switch (error) {
            case "maxDate": {
                return "Date different not be higher than 31 days";
            }

            default: {
                return "";
            }
        }
    }, [error]);
    const chartDataSet = {
        labels: reportData.dataByType?.currentData.map(
            (row) => row.groupByColumn
        ),
        datasets: [
            {
                label: "Current " + reportTypeValue.split(" ")[1],
                fill: true,
                data: reportData.dataByType?.currentData.map(
                    (row) => row.total_amount
                ),
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
            {
                label: "Last " + reportTypeValue.split(" ")[1],
                fill: true,
                data: reportData.dataByType?.lastData.map(
                    (row) => row.total_amount
                ),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
            },
        ],
    };
    const barChartDataSet = {
        labels: reportData.totalTransactionData?.map(
            (row) => row.groupByColumn
        ),
        // labels:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        datasets: [
            {
                label: "Total Transaction",
                data: reportData.totalTransactionData?.map(
                    (row) => row.totalTransaction
                ),
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
        ],
    };
    const doughnutChartDataSet = {
        labels: reportData.soldProducts?.map((row) => row.name),
        // labels : [],
        datasets: [
            {
                label: "Number of products sold",
                data: reportData.soldProducts?.map((row) => row.total_sold),
                // data:[],
                backgroundColor: generateRandomColors(
                    reportData.soldProducts?.length
                ),
            },
        ],
    };
    const downloadReport = async () => {
        try {
            const response = await axios.get(
                "/report/download?startDate=" +
                    fromDate +
                    "&endDate=" +
                    toDate +
                    "&type=" +
                    reportTypeValue,
                { responseType: "blob" }
            );
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const fileName = response.headers
                .get("content-disposition")
                .split("=")[1];
            FileSaver.saveAs(blob, fileName);
        } catch (error) {}
    };

    console.log(reportData);
    return (
        <>
            <Loading isLoading={isLoading} />
            <div className="container">
                <div className="mb-4">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="none"
                            color="#243ab0"
                            href={route("dashboard")}
                        >
                            Home
                        </Link>
                        <Typography color="#243ab0" sx={{ fontWeight: "600" }}>
                            Reports
                        </Typography>
                    </Breadcrumbs>
                </div>
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-12">
                        <div className="card w-100 shadow-sm">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-4">
                                        <FormControl
                                            sx={{ m: 1, width: "100%" }}
                                        >
                                            <InputLabel id="demo-multiple-name-label">
                                                <span>
                                                    Report Type
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </span>
                                            </InputLabel>
                                            <Select
                                                labelId="demo-multiple-name-label"
                                                id="demo-multiple-name"
                                                value={reportTypeValue}
                                                onChange={(e) =>
                                                    setReportTypeValue(
                                                        e.target.value
                                                    )
                                                }
                                                input={
                                                    <OutlinedInput label="Report Type" />
                                                }
                                                MenuProps={MenuProps}
                                            >
                                                {reportType.map((reports) => (
                                                    <MenuItem
                                                        key={reports}
                                                        value={reports}
                                                    >
                                                        {reports}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-lg-4">
                                        <DemoContainer
                                            components={["DatePicker"]}
                                        >
                                            <DatePicker
                                                label={
                                                    <span>
                                                        From
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                    </span>
                                                }
                                                variant="outlined"
                                                className="w-100 mb-4"
                                                value={fromDate}
                                                disableFuture
                                                onChange={(date) =>
                                                    setFromDate(
                                                        dayjs(date).format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                }
                                            />
                                        </DemoContainer>
                                    </div>
                                    <div className="col-lg-4">
                                        <DemoContainer
                                            components={["DatePicker"]}
                                        >
                                            <DatePicker
                                                label={
                                                    <span>
                                                        To
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                    </span>
                                                }
                                                variant="outlined"
                                                className="w-100 mb-4"
                                                value={toDate}
                                                disableFuture
                                                onChange={(date) =>
                                                    setToDate(
                                                        dayjs(date).format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                }
                                                onError={(err) => setError(err)}
                                                maxDate={maxDate}
                                                slotProps={{
                                                    textField: {
                                                        helperText:
                                                            errorMessage,
                                                    },
                                                }}
                                            />
                                        </DemoContainer>
                                    </div>
                                </div>
                                <div className="mt-4 d-flex justify-content-end button-group">
                                    {reportData && (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ marginRight: "10px" }}
                                            onClick={() => {
                                                downloadReport();
                                            }}
                                        >
                                            <Download /> Download Report
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        onClick={() => getReportData()}
                                    >
                                        <Search /> Search
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {reportData && (
                    <>
                        <div className="row mt-4">
                            <div className="col-lg-12">
                                <div className="card w-100">
                                    <div className="card-body shadow-sm">
                                        <h5 className="card-title">
                                            {reportTypeValue}
                                        </h5>
                                        <div
                                            className="chart-container"
                                            style={{
                                                position: "relative",
                                                height: "40vh",
                                                width: "80vw",
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
                        </div>
                        <div className="row mt-4">
                            <div className="col-lg-8">
                                <div className="card w-100 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            Total Transaction
                                        </h5>
                                        <div
                                            className="chart-container"
                                            style={{
                                                position: "relative",
                                                height: "40vh",
                                                width: "55vw",
                                            }}
                                        >
                                            <Bar
                                                data={barChartDataSet}
                                                options={options}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="card w-100 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            Total Sales Product
                                        </h5>
                                        <div
                                            className="chart-container"
                                            style={{
                                                position: "relative",
                                                height: "40vh",
                                                width: "25vw",
                                            }}
                                        >
                                            <Doughnut
                                                data={doughnutChartDataSet}
                                                options={options}
                                                plugins={[centerTextPlugin]}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                <div className="row mt-4">
                    {reportData.dataByType?.detailCardData &&
                        Object.values(reportData.dataByType.detailCardData).map(
                            (item, index) => (
                                <div className="col-lg-4" key={index}>
                                    <div className="card w-100 h-100 shadow-sm">
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                {
                                                    Object.keys(
                                                        reportData.dataByType
                                                            .detailCardData
                                                    )[index]
                                                }
                                            </h5>
                                            <p className="detail-text">
                                                {index === 2 ? (
                                                    item > 0 ? (
                                                        <ArrowDropUp
                                                            color="success"
                                                            sx={{
                                                                fontSize: 30,
                                                            }}
                                                        />
                                                    ) : item < 0 ? (
                                                        <ArrowDropDown
                                                            color="error"
                                                            sx={{
                                                                fontSize: 30,
                                                            }}
                                                        />
                                                    ) : null
                                                ) : null}
                                                {index !== 2
                                                    ? item
                                                    : `${Math.abs(item)}%`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                </div>
            </div>
        </>
    );
};

export default ReportPage;

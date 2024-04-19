import ErrorBoundary from "@/Layouts/ErrorBoundary";
import Sidebar from "@/Layouts/Main";
import { Switch } from "@mui/base";
import { LocalizationProvider } from "@mui/x-date-pickers";
import React from "react";
import Dashboard from "../Components/Dashboard";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const Home = (props) => {
    return (
        <div className="container">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ErrorBoundary>
                    <Sidebar {...props} />
                </ErrorBoundary>
            </LocalizationProvider>
        </div>
    );
};

export default Home;

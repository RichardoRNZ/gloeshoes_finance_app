import ErrorBoundary from "@/Layouts/ErrorBoundary";
import Sidebar from "@/Layouts/Main";
import { Switch } from "@mui/base";
import React from "react";
import Dashboard from "../Components/Dashboard";

const Home = (props) => {
    return (
        <div className="container">
            <ErrorBoundary>
                <Sidebar {...props} />
            </ErrorBoundary>
        </div>
    );
};

export default Home;

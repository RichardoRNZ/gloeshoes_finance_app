import Customer from "@/Components/CustomerMenu/CustomerList";
import Dashboard from "@/Components/Dashboard";
import OrderDetail from "@/Components/OrderMenu/OrderDetail";
import OrderList from "@/Components/OrderMenu/OrderList";
import Product from "@/Components/ProductMenu/ProductList";
import ReportPage from "@/Components/Reports/ReportPage";
import ChangeUserForm from "@/Components/UserMenu/ChangeUserForm";

import { BarChart, Groups, Home, Inventory2, Receipt } from "@mui/icons-material";

export const renderMenuIcon = (menu) => {
    switch (menu) {
        case "Dashboard":
            return <Home />;
        case "Customers":
            return <Groups />;
        case "Products":
            return <Inventory2 />;
        case "Orders":
            return <Receipt />;
        case "Reports":
            return <BarChart />;
        default:
            return null;
    }
};

export const sidebarMenuRouter = (menuUrl, props) => {
    if (menuUrl.includes("/order/detail-page/")) {
        return <OrderDetail {...props} />;
    }
    switch (menuUrl) {
        case "/dashboard":
            return <Dashboard {...props}/>;
        case "/customer":
            return <Customer {...props}/>;
        case "/product":
            return <Product {...props}/>;
        case "/orders":
            return <OrderList {...props}/>;
        case "/reports":
            return <ReportPage {...props}/>;
        case "/change/user/page":
            return <ChangeUserForm {...props}/>;
        default:
            return null;
    }
};



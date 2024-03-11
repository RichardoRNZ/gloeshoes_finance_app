import Customer from "@/Components/CustomerMenu/Customer";
import Dashboard from "@/Components/Dashboard";
import { BarChart, Construction, Groups, Home, Inventory2, Receipt } from "@mui/icons-material";

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
        case "Vendors":
            return <Construction />;
        default:
            return null;
    }
};

export const sidebarMenuRouter = (menuUrl, props) => {
    switch (menuUrl) {
        case "/dashboard":
            return <Dashboard />;
        case "/customer":
            return <Customer {...props}/>;
        // case "/products":
        //     return <Inventory2 />;
        // case "Orders":
        //     return <Receipt />;
        // case "Reports":
        //     return <BarChart />;
        // case "Vendors":
        //     return <Construction />;
        default:
            return null;
    }
};


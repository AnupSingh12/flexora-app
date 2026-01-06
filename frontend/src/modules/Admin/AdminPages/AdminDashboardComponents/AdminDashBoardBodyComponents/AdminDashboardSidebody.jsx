import Dashboard from "./AdminDashboardSIdebodyComponents/Dashboard.jsx";
import Customers from "./AdminDashboardSIdebodyComponents/Customers.jsx";
import Stocks from "./AdminDashboardSIdebodyComponents/Stocks.jsx";
import Queries from "./AdminDashboardSIdebodyComponents/Queries.jsx";
import Orders from "./AdminDashboardSIdebodyComponents/Orders.jsx";
import Delivery from "./AdminDashboardSIdebodyComponents/Delivery.jsx";
import Reports from "./AdminDashboardSIdebodyComponents/Reports.jsx";
import Settings from "./AdminDashboardSIdebodyComponents/Settings.jsx";
import Coupon from "./AdminDashboardSIdebodyComponents/Coupon.jsx";

export default function AdminDashboardSidebody() {
  return (
    <>
      <section id="adb-content" className="adb-content">
        <Dashboard />
        <Customers />
        <Stocks />
        <Delivery />
        <Coupon />
        <Queries />
        <Orders />
        <Reports />
        <Settings />
      </section>
    </>
  );
}

import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function OrdersAdminPage() {
  const [orderData, setOrderData] = useState([]);
  async function loadNumberOfOrders() {
    try {
      const res = await fetch(`${API_URL}/api/order-details-admin`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        console.log("Unable to get the order details");
      }

      const rawData = await res.json();
      const orderData = rawData.data;
      setOrderData(orderData);
    } catch (error) {
      console.log("Unable to find ");
    }
  }
  useEffect(() => {
    loadNumberOfOrders();
  }, []);
  return (
    <>
      <section id="orders" className="adb-panel">
        <div className="adb-page-head">
          <h2>Orders</h2>
          <p className="adb-text-muted">Full customer order details.</p>
        </div>

        <div className="adb-card">
          <table className="adb-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orderData.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{data.userName}</td>
                  <td>{data.price}</td>
                  <td>
                    <span className="adb-badge adb-badge-pending">
                      {data.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

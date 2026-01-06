import { useEffect, useState } from "react";
import "./Orders.css";
import OrderCard from "./OrdersComponents/ordersCard.jsx";
import Navbar from "../navbar/navbar.jsx";
import Footer from "../footer/footer.jsx";
import RelatedProducts from "../../HomePage/HomePageComponents/relatedProducts.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function Orders() {
  const [orders, setorders] = useState([]);

  useEffect(() => {
    try {
      async function getOrderDetails() {
        const res = await fetch(`${API_URL}/api/order-details`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          console.log("Unable to get the response from the backend code");
          setorders([]);
        }
        const rawOrderData = await res.json();
        // Support multiple shapes: either data is an array, or data.orderDetails
        let orderData =
          rawOrderData && rawOrderData.data ? rawOrderData.data : rawOrderData;
        if (orderData && orderData.orderDetails) {
          orderData = orderData.orderDetails;
        }
        // Ensure we have an array
        if (!Array.isArray(orderData)) orderData = [];
        setorders(orderData);
      }
      getOrderDetails();
    } catch (error) {
      console.log("Error while lodaing orders details", error);
    }
  }, []);
  return (
    <>
      <Navbar />
      <section className="fx-orders-container">
        <h2 className="fx-orders-title">My Orders</h2>
        {orders.length === 0 ? (
          <>
            <h3>Haven't bought anything yet</h3>
            <RelatedProducts />
          </>
        ) : (
          <div className="fx-orders-list">
            {orders.map((order) => (
              <OrderCard key={order._id || order.orderId} order={order} />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

export { Orders };

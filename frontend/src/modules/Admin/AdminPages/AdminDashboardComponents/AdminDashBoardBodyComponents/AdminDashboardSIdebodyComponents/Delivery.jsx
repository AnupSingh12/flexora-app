import { useState, useEffect } from "react";
import ViewDeliveryStatusModal from "../../../../../modals/viewDeliveryStatusModal.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function Delivery() {
  const [deliveryStatus, setDeliveryStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setDeliveryStatus(orderData);
    } catch (error) {
      console.log("Unable to find ");
    }
  }

  useEffect(() => {
    loadNumberOfOrders();
  }, []);

  function openModal(status) {
    setSelectedStatus(status);
    setIsModalOpen(true);
  }

  function closeModal() {
    setSelectedStatus(null);
    setIsModalOpen(false);
  }

  function handleActionComplete(updatedQuery) {
    setQueries(
      queries.map((q) => (q._id === updatedQuery._id ? updatedQuery : q))
    );
    closeModal();
  }

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return isoString;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <>
      <section id="delivery" className="adb-panel">
        <div className="adb-page-head">
          <h2>Delivery Status</h2>
          <p className="adb-text-muted">Track deliveries in real-time.</p>
        </div>

        <div className="adb-card">
          <table className="adb-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Courier</th>
                <th>ETA</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>

            <tbody>
              {deliveryStatus && deliveryStatus.length > 0 ? (
                deliveryStatus.map((data, index) => (
                  <tr key={index}>
                    <td>#{index + 1}</td>
                    <td>BlueShip</td>
                    <td>{formatDate(data.createdAt)}</td>
                    <td>
                      <span className="adb-badge adb-badge-in-progress">
                        {data.orderStatus}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => openModal(data)}
                        className="adb-btn adb-btn-small"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="adb-text-muted">
                    No deliveries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {isModalOpen && (
        <ViewDeliveryStatusModal
          deliveryStatus={selectedStatus}
          onClose={closeModal}
          onActionComplete={handleActionComplete}
        />
      )}
    </>
  );
}

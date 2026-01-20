import "./viewDeliveryStatusModal.css";

const API_URL = import.meta.env.VITE_API_URL;
export default function ViewDeliveryStatusModal({
  deliveryStatus,
  onClose,
  onActionComplete,
}) {
  console.log("---deliveryStatus----", deliveryStatus);
  if (!deliveryStatus) return null;

  const updateStatus = async (status) => {
    try {
      const res = await fetch(`${API_URL}/api/update-deliveryStatus-status`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          deliveryStatus,
        }),
      });

      if (!res.ok) {
        console.log("unable to set the status of deliveryStatus ");
      } else {
        onActionComplete({ ...deliveryStatus, status: status });
      }

      onClose();
    } catch (error) {
      console.log("Unable to set the status of deliveryStatus", error);
    }
  };

  return (
    <div className="dsm-overlay">
      <div className="dsm-modal-lg">
        <div className="dsm-header">
          <h3>Customer Query Details</h3>
          <button className="dsm-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="dsm-section">
          <h3>Personal Information</h3>
          <div className="dsm-grid">
            <div>
              <strong>Name:</strong> {deliveryStatus.userName}
            </div>
            <div>
              <strong>order ID:</strong> {deliveryStatus.index + 1}
            </div>
            <div>
              <strong>Price:</strong> {deliveryStatus.price}
            </div>
            <div>
              <strong>OrderStatus:</strong> {deliveryStatus.orderStatus}
            </div>
            <div>
              <strong>Date of Joining:</strong>{" "}
              {new Date(deliveryStatus.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="dsm-footer">
          {deliveryStatus.orderStatus === "pending" ? (
            <button
              className="dsm-btn dsm-btn-progress"
              onClick={() => updateStatus("shipped")}
            >
              shipped
            </button>
          ) : deliveryStatus.orderStatus === "shipped" ? (
            <button
              className="dsm-btn dsm-btn-progress"
              onClick={() => updateStatus("out-for-delivery")}
            >
              out for delivery
            </button>
          ) : (
            <button
              className="dsm-btn dsm-btn-delivered"
              onClick={() => updateStatus("delivered")}
            >
              delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

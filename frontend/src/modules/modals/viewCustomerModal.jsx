import { useEffect, useState } from "react";
import "./viewCustomerModal.css";

const API_URL = import.meta.env.VITE_API_URL;
export default function ViewCustomerModal({
  customer,
  onClose,
  onActionComplete,
}) {
  const [showMoreOrders, setShowMoreOrders] = useState(false);
  const [orders, setOrders] = useState([]);

  async function loadOrders(customer) {
    try {
      const res = await fetch(
        `${API_URL}/users/api/get-customers-order-details`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer,
          }),
        },
      );

      if (!res.ok) {
        console.log("Unable to get the data from the api ");
      }
      const rawData = await res.json();
      const customersOrderData = rawData.data;
      setOrders(customersOrderData[0].items);
    } catch (error) {
      console.log("Error while getting the cutomer's order details");
    }
  }

  async function handleHoldAccount(customer) {
    try {
      const res = await fetch(`${API_URL}/api/make-user-account-onHold`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
        }),
      });

      if (!res.ok) {
        console.log("unable to fetch onHold api");
      } else {
        onActionComplete({ ...customer, isActive: "onHold" });
      }
    } catch (error) {
      console.log("Something went wrong while making account status on hold ");
    }
  }

  async function handleUnHoldAccount(customer) {
    try {
      const res = await fetch(`${API_URL}/api/make-user-account-UnHold`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
        }),
      });

      if (!res.ok) {
        console.log("unable to fetch unHold api");
      } else {
        onActionComplete({ ...customer, isActive: "active" });
      }
    } catch (error) {
      console.log("Something went wrong while making account status on hold ");
    }
  }

  async function handleSoftDeleteAccount(customer) {
    try {
      const res = await fetch(`${API_URL}/api/make-user-account-softDelete`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
        }),
      });

      if (!res.ok) {
        console.log("unable to fetch Soft Delete api");
      } else {
        onActionComplete({ ...customer, isActive: "deleted" });
      }
    } catch (error) {
      console.log(
        "Something went wrong while making account status on Delete ",
      );
    }
  }

  async function handlePermanentDeleteAccount(Customer) {
    try {
      const res = await fetch(`${API_URL}/api/delete-user-account-data`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
        }),
      });

      if (!res.ok) {
        console.log("unable to fetch permanently delete account api");
      } else {
        onActionComplete({ ...customer, isActive: "deleted" });
      }
    } catch (error) {
      console.log(
        "Something went wrong while making account status on delete ",
      );
    }
  }
  useEffect(() => {
    loadOrders(customer);
  }, []);
  if (!customer) return null;

  const visibleOrders = showMoreOrders ? orders : orders.slice(0, 4);

  return (
    <div className="vcm-overlay">
      <div className="vcm-modal">
        {/* HEADER */}
        <div className="vcm-header">
          <h2>Customer Details</h2>
          <button className="vcm-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="vcm-section">
          <h3>Personal Information</h3>
          <div className="vcm-grid">
            <div>
              <strong>Name:</strong> {customer.userName}
            </div>
            <div>
              <strong>Email:</strong> {customer.email}
            </div>
            <div>
              <strong>Contact:</strong> +91 {customer.contactNumber}
            </div>
            <div>
              <strong>Gender:</strong> {customer.gender || "N/A"}
            </div>
            <div>
              <strong>Date of Joining:</strong>{" "}
              {new Date(customer.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="vcm-section">
          <h3>Order Details</h3>

          {orders.length === 0 ? (
            <p className="vcm-muted">No orders placed yet.</p>
          ) : (
            <>
              <div className="vcm-orders">
                {visibleOrders.map((order, index) => (
                  <div className="vcm-order-card" key={index}>
                    <img
                      src={order.product.thumbnail}
                      alt="product"
                      className="vcm-product-img"
                    />
                    <div className="vcm-order-info">
                      <p>
                        <strong>Product Name </strong> {order.product.title}
                      </p>
                      <p>
                        <strong>MRP:</strong> ₹{order.product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {orders.length > 4 && (
                <button
                  className="vcm-show-more"
                  onClick={() => setShowMoreOrders(!showMoreOrders)}
                >
                  {showMoreOrders ? "Show Less" : "Show More"}
                </button>
              )}
            </>
          )}
        </div>

        {customer.isActive === "deleted" ? (
          <div className="vcm-footer">
            <button
              onClick={() => handlePermanentDeleteAccount(customer)}
              className="vcm-btn delete"
            >
              Remove Account data
            </button>
          </div>
        ) : (
          <div className="vcm-footer">
            {customer.isActive === "active" ? (
              <button
                onClick={() => handleHoldAccount(customer)}
                className="vcm-btn hold"
              >
                Hold Account
              </button>
            ) : (
              <button
                onClick={() => handleUnHoldAccount(customer)}
                className="vcm-btn hold"
              >
                Unhold Account
              </button>
            )}

            <button
              onClick={() => handleSoftDeleteAccount(customer)}
              className="vcm-btn delete"
            >
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import ViewCustomerModal from "../../../../../modals/viewCustomerModal.jsx";
const API_URL = import.meta.env.VITE_API_URL;

export default function Customers() {
  const [customersInfo, setCustomersInfo] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // LOAD CUSTOMERS TABLE
  async function loadCustomers() {
    try {
      const res = await fetch(`${API_URL}/users/api/get-customers-info`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        console.log("Unable to get the user Data from the API");
      }
      const rawData = await res.json();
      const customersInfoDAta = rawData.data;
      setCustomersInfo(customersInfoDAta);
    } catch (error) {
      console.log("Unable to get the Customer information ");
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  function openModal(customer) {
    setIsModalOpen(true);
    setSelectedCustomer(customer);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  }

  function handleActionComplete(updatedCustomer) {
    setCustomersInfo(
      customersInfo.map((c) =>
        c._id === updatedCustomer._id ? updatedCustomer : c
      )
    );
    closeModal();
  }
  return (
    <>
      <section id="customers" className="adb-panel">
        <div className="adb-page-head">
          <h2>Customers</h2>
          <p className="adb-text-muted">
            Search, view or export customer data.
          </p>
        </div>

        <div className="adb-card">
          <div className="adb-card-actions">
            <input
              id="custSearch"
              type="text"
              className="adb-input"
              placeholder="Search customer name, email..."
            />
            <button id="exportCustomers" className="adb-btn">
              Export CSV
            </button>
          </div>

          <table className="adb-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody id="adb-customers">
              {customersInfo.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Customers Till now
                  </td>
                </tr>
              ) : (
                customersInfo.map((customer, index) => {
                  return (
                    <tr key={customer._id}>
                      <td>{index + 1}</td>
                      <td>{customer.userName}</td>
                      <td>{customer.email}</td>
                      <td>+91 {customer.contactNumber}</td>
                      <td>
                        {customer.isActive === "active" ? (
                          <button
                            className="adb-btn adb-btn-small"
                            onClick={() => openModal(customer)}
                          >
                            View
                          </button>
                        ) : customer.isActive === "onHold" ? (
                          <button
                            className="adb-btn-hold adb-btn-small"
                            onClick={() => openModal(customer)}
                          >
                            On Hold
                          </button>
                        ) : (
                          <button
                            className="adb-btn-deleted adb-btn-small"
                            onClick={() => openModal(customer)}
                          >
                            Deleted
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
      {isModalOpen && (
        <ViewCustomerModal
          customer={selectedCustomer}
          onClose={closeModal}
          onActionComplete={handleActionComplete}
        />
      )}
    </>
  );
}

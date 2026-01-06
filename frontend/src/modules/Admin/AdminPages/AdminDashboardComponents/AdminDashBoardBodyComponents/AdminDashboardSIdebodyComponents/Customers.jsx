export default function Customers() {
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
                <th>Orders</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody id="adb-customers"></tbody>
          </table>
        </div>
      </section>
    </>
  );
}

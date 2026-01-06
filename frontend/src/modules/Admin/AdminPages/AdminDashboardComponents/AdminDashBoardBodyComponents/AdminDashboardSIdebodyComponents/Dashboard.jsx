export default function Dashboard() {
  return (
    <>
      <section id="dashboard" className="adb-panel adb-panel-active">
        <div className="adb-page-head">
          <h2>Dashboard</h2>
          <p className="adb-text-muted">
            Quick overview of customers, stock and deliveries.
          </p>
        </div>

        <div className="adb-stat-cards">
          <div className="adb-stat-card">
            <h3>Total Customers</h3>
            <p className="adb-stat-number">1,234</p>
            <p className="adb-text-muted">New this month: 64</p>
          </div>

          <div className="adb-stat-card">
            <h3>Items in Stock</h3>
            <p className="adb-stat-number">5,670</p>
            <p className="adb-text-muted">Low stock: 32</p>
          </div>

          <div className="adb-stat-card">
            <h3>Orders (Today)</h3>
            <p className="adb-stat-number">48</p>
            <p className="adb-text-muted">Pending delivery: 12</p>
          </div>

          <div className="adb-stat-card">
            <h3>Revenue (Month)</h3>
            <p className="adb-stat-number">₹ 4,82,000</p>
            <p className="adb-text-muted">vs last month +7%</p>
          </div>
        </div>

        <div className="adb-grid-two">
          <div className="adb-card">
            <h4>Recent Orders</h4>
            <div style={{ overflowX: "auto" }}>
              <table className="adb-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#1021</td>
                    <td>R. Sharma</td>
                    <td>3</td>
                    <td>
                      <span className="adb-badge adb-badge-delivered">
                        Delivered
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>#1022</td>
                    <td>S. Roy</td>
                    <td>1</td>
                    <td>
                      <span className="adb-badge adb-badge-in-progress">
                        Out for Delivery
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>#1023</td>
                    <td>N. Patel</td>
                    <td>2</td>
                    <td>
                      <span className="adb-badge adb-badge-pending">
                        Pending
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="adb-card">
            <h4>Low Stock Alerts</h4>
            <ul className="adb-list">
              <li>White Sneakers — 3 left</li>
              <li>Classic Leather Watch — 2 left</li>
              <li>Black Tee (L) — 4 left</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

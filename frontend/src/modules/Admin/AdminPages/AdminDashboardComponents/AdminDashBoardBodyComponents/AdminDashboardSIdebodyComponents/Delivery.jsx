export default function Delivery() {
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
              <tr>
                <td>#1022</td>
                <td>BlueShip</td>
                <td>2025-09-30</td>
                <td>
                  <span className="adb-badge adb-badge-in-progress">
                    Out for Delivery
                  </span>
                </td>
                <td>
                  <button className="adb-btn adb-btn-small">Update</button>
                </td>
              </tr>

              <tr>
                <td>#1018</td>
                <td>PostFast</td>
                <td>2025-09-28</td>
                <td>
                  <span className="adb-badge adb-badge-delivered">
                    Delivered
                  </span>
                </td>
                <td>
                  <button className="adb-btn adb-btn-small">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

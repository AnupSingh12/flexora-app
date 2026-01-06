export default function Orders() {
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
              <tr>
                <td>#1030</td>
                <td>Vikas</td>
                <td>₹1,200</td>
                <td>
                  <span className="adb-badge adb-badge-pending">Pending</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

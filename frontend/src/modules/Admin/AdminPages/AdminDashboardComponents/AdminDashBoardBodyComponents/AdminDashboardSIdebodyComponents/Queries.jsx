export default function Queries() {
  return (
    <>
      <section id="queries" className="adb-panel">
        <div className="adb-page-head">
          <h2>Queries</h2>
          <p className="adb-text-muted">Customer queries submitted.</p>
        </div>

        <div className="adb-card">
          <table className="adb-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody id="adb-queries"></tbody>
          </table>
        </div>
      </section>
    </>
  );
}

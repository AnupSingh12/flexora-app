import { useState } from "react";

export default function Queries() {
  const [querries, setQuerries] = useState({
    name: "",
    email: "",
    querry: "",
  });
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
                <th>Querry</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody id="adb-queries">
              <tr>
                <th>1</th>
                <th>Anup Singh</th>
                <th>anup@gmail.com</th>
                <th>Delete Id</th>
                <th>adbc</th>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

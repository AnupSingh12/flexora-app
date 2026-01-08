import { useEffect, useState } from "react";
import ViewQueryModal from "./../../../../../modals/viewQueryModal.jsx";

const API_URL = import.meta.env.VITE_API_URL;
export default function Queries() {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function loadQueries() {
    try {
      const res = await fetch(`${API_URL}/api/get-customer-queries`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        console.log("Failed to get queries data from API");
      }

      const rawData = await res.json();
      const queriesData = rawData.data;
      setQueries(queriesData);
    } catch (error) {
      console.log("Unable to get the queries from backend", error);
    }
  }

  useEffect(() => {
    loadQueries();
  }, []);

  function openModal(query) {
    setSelectedQuery(query);
    setIsModalOpen(true);
  }

  function closeModal() {
    setSelectedQuery(null);
    setIsModalOpen(false);
  }
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

            <tbody>
              {queries.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No queries found
                  </td>
                </tr>
              ) : (
                queries.map((query, index) => {
                  return (
                    <tr key={query._id}>
                      <td>{index + 1}</td>
                      <td>{query.userName}</td>
                      <td>{query.userEmail}</td>
                      <td>
                        {query.status === "view" ? (
                          <button
                            className="adb-btn adb-btn-small"
                            onClick={() => openModal(query)}
                          >
                            {query.status}
                          </button>
                        ) : (
                          <button
                            className="adb-btn-inprog adb-btn-small"
                            onClick={() => openModal(query)}
                          >
                            {query.status}
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
        <ViewQueryModal query={selectedQuery} onClose={closeModal} />
      )}
    </>
  );
}

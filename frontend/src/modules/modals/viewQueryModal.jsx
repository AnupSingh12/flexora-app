import "./viewQueryModal.css";

const API_URL = import.meta.env.VITE_API_URL;
export default function ViewQueryModal({ query, onClose, onActionComplete }) {
  if (!query) return null;

  const updateStatus = async (status) => {
    try {
      const res = await fetch(`${API_URL}/api/update-query-status`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          query,
        }),
      });

      if (!res.ok) {
        console.log("unable to set the status of query ");
      } else {
        onActionComplete({ ...query, status: status });
      }

      onClose();
    } catch (error) {
      console.log("Unable to set the status of query", error);
    }
  };

  return (
    <div className="fqm-overlay">
      <div className="fqm-modal-lg">
        <div className="fqm-header">
          <h3>Customer Query Details</h3>
          <button className="fqm-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="fqm-body">
          <div className="fqm-section">
            <span className="fqm-label">Query Subject</span>
            <div className="fqm-box">
              {query.subject || "No subject provided"}
            </div>
          </div>

          <div className="fqm-section">
            <span className="fqm-label">Query Message</span>
            <div className="fqm-box fqm-message-box">
              {query.message || "No message provided"}
            </div>
          </div>
        </div>

        <div className="fqm-footer">
          {query.status === "view" ? (
            <button
              className="fqm-btn fqm-btn-progress"
              onClick={() => updateStatus("in-progress")}
            >
              Work In Progress
            </button>
          ) : (
            ""
          )}

          <button
            className="fqm-btn fqm-btn-resolved"
            onClick={() => updateStatus("resolved")}
          >
            Query Resolved
          </button>
        </div>
      </div>
    </div>
  );
}
